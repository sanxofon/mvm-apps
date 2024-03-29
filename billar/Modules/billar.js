// particle [[x_0, v_0], [v_x, v_y]]
// wall [[x_0, y_0], [x_1, y_1]]
// Make the paper scope global, by injecting it into window:
paper.install(window);

const rot_90 = [ [0, -1],
                 [1,0  ]];

const specular_ker = [[1, 0, 0], [0, -1, 0], [0, 0, 1]]; // kernel | specular 

const invert_mat = [[1, 0, 0], [0, -1, 0], [0, 0, -1]];

const tol = 10e-6;

const window_size = [500, 500]; //

var states = [];

var st_lst = [];

var initial_vec_path;

var w, h, initial_position, initial_omega, initial_heading, initial_wv, particle, num_iter;

var del_x, del_y;
// HTML STUFF

var wall_lst = [];
var wall_count = 0
var  wall_ID, wall_lst_key;

// CHART stuff
var ctx, scatterChart;

// Vector/Matrix stuff
var cos_theta_out, ker;

getTheta = function(v1, v2){
    var det = v1[0]*v2[1] - v2[0]*v1[1];
    var dot = math.dot(v1, v2);
    var theta = math.atan2(det, dot);
    return theta 
}


no_slip_ker = function(gamma){
    const denom = 1 + gamma**2;
    const a = (1-gamma**2)/denom;
    const b = 2*gamma/denom
    return [ [-a, -b, 0], [-b, a, 0], [0, 0, -1] ];
}

reflect = function(wv, n){
    // GOHERE
    var wall_norm = normalize(n);
    var omega = wv[0];
    var v = wv.slice(2, 3);

    // rotation fix 
    
    /*  
    var j_vec = n[0]<0 ? [0, -1] : [0, 1]; //x in pos dir aka j | to align wall normal vector -> y-axis
    var i_vec = n[0]<0 ? [-1, 0] : [-1, 0]; //x in pos dir aka j | to align wall normal vector -> y-axis
    */

    const j_vec = [0, 1];
    const i_vec = [1, 0];
    // GET THE ANGLE
    var cos_theta = math.dot(wall_norm, j_vec);    
    
    //const theta = math.acos(cos_theta);  // get the angle between normal vector and the y-axis

    var theta = n[0] < 0 ? -math.acos(cos_theta) : math.acos(cos_theta);      
    //const sin_theta = n[0]<0 ? -math.sin(theta) : math.sin(theta);

    var sin_theta = math.sin(theta);
    cos_theta = math.cos(theta);
    //console.log(theta);

    // Rotation Matrix
    const rot_theta = [[1, 0, 0], [0, cos_theta, -1*sin_theta], [0, sin_theta, cos_theta]];
    
    
    var ref_mat = math.multiply(
                  math.multiply(math.transpose(rot_theta), ker), rot_theta);
    
    var v_out_0 = math.multiply(math.multiply(ker, rot_theta), wv).slice(1, 3);

    cos_theta_out = math.dot(i_vec, v_out_0); //update theta

    //var v_out = wv;//math.multiply(invert_mat, wv);
    
    return math.multiply(ref_mat, wv)
}


// OTHER STUFF
getDist = function(p0, p1){
    return math.norm(math.subtract(p0, p1))
}

slideToVec = function(theta){
    // theta = 270 - parseInt(theta);  
    theta = 270 - parseFloat(theta);	
		
	theta = Math.PI * theta / 180;
    var x = math.cos(theta);
    var y = math.sin(theta);

    document.getElementById('heading').value = "(" + math.round(x, 5) + ", " + math.round(y,5) + ")";


    initial_position = parseCord(document.getElementById('position').value);
    initial_heading  = [x, y];
    
    initial_heading = math.multiply(initial_heading, 30);

    initial_vec_path.segments[1].point = new Point(math.add(initial_position, initial_heading));
      
    //drawVec();
}

/*slideToVec_blue = function(theta){
    theta = 270 - parseInt(theta);	
		
	theta = Math.PI * theta / 180;
    var x = math.cos(theta);
    var y = math.sin(theta);

    document.getElementById('heading_blue').value = "(" + math.round(x, 3) + ", " + math.round(y,3) + ")";


    initial_position_blue = parseCord(document.getElementById('position_blue').value);
    initial_heading_blue  = [x, y];
    
    initial_heading_blue = math.multiply(initial_heading_blue, 30);

    initial_vec_path_blue.segments[1].point = new Point(math.add(initial_position_blue, initial_heading_blue));
      
    //drawVec();
}*/

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
} 

// BILLIARD STUFF

xvToEq = function(xv){
    const x = xv[0];
    const v = xv[1];

    try{
        const m = v[1]/v[0];

        if (Math.abs(m) > 10e10) {throw new Error('Undefined slop bc of big number');}
        return [ [m, -1, 0], (m*x[0] - x[1])]
    }
    catch(err){
        // console.log("Undefined slope");
        return [ [1, 0, 0], x[0] ]
    }
}

stToEq = function(st){

    var start = st.slice(0,2);
    var end   = st.slice(2,4);
	
	var delta = math.subtract(end, start);

    try{
        const m = delta[1]/delta[0];

        if (Math.abs(m) > 10e10) {throw new Error('Undefined slop bc of big number');}
        return [ [m, -1, 0], (m*start[0] - start[1])]
    }
    catch(err){
        // console.log("Undefined slope");
        return [ [1, 0, 0], start[0] ]
    }
}

collide = function(p, w){
    /*
     * p : particle
     * w : wall
     */
    // console.log(w);
    var x_p = p[0];
    var v_p = p[1].slice(1, 3);
    var w_Ab = stToEq(w);
    var mat_A = [ 
                    [1,     0,      -v_p[0]],
                    [0,     1,      -v_p[1]],
                    w_Ab[0],
                  ];

    var vec_b = [x_p[0], x_p[1], w_Ab[1]];
    
    // console.log(mat_A);
    // console.log(vec_b);
    
    var res = math.transpose(math.lusolve(mat_A, vec_b))[0];
    
    //console.log(res);

    if(res[2] < 0){
        res = [0,0, -1];
    } else {
        var a_pt = w.slice(0, 2);
        var b_pt = w.slice(2, 4);
        
        var c_pt = res.slice(0,2);

        var ab = math.distance(a_pt, b_pt);
        var ac = math.distance(a_pt, c_pt);
        var bc = math.distance(b_pt, c_pt);
        
        if (math.abs(ac + bc - ab) > tol){
            res = [0, 0, -1];
        }
    }
    return res;
}

get_intersection = function(p, w){
    /*
     * p : particle
     * w : wall
     */
    // console.log(w);
    var x_p = p[0];
    var v_p = p[1].slice(1, 3);
    var w_Ab = stToEq(w);
    var mat_A = [ 
                    [1,     0,      -v_p[0]],
                    [0,     1,      -v_p[1]],
                    w_Ab[0],
                  ];

    var vec_b = [x_p[0], x_p[1], w_Ab[1]];
    
    // console.log(mat_A);
    // console.log(vec_b);
    
    var res = math.transpose(math.lusolve(mat_A, vec_b))[0];

    var a_pt = w.slice(0, 2);
    var b_pt = w.slice(2, 4);
    
    var c_pt = res.slice(0,2);

    var ab = math.distance(a_pt, b_pt);
    var ac = math.distance(a_pt, c_pt);
    var bc = math.distance(b_pt, c_pt);
    
    if (math.abs(ac + bc - ab) > tol){
        res = [0, 0, -1];
    }
    
    return res;
}
normalize = function(v){
    /*
    input: vector
    output: normalized vector
    */
    return math.divide(v, math.norm(v))
}

vectorOut = function(ptc, w){
    /*
     * FUNCTION: 
     * - Calculating the collision point, reflected vector, and collution time 
     * INPUT:
     * ptc 
     * -[ [x_0, y_0], [omega,  v_x0, v_y0] ]
     * -the vector of the particle
     * w
     * -[ [x_w0, y_w0], [wx, wy] ];
     * -the vector of the wall

     * OUTPUT:
     * [ [x_1, y_1], [v_x1, v_y1], t]       
     */
   	// console.log(w); 
    try{
        // Solving for colliding point
        var sol = collide(ptc, w);
        
        // CASE 1: t < 0
        if (sol[2] < 0) {
            return [ [[sol[0], sol[1]], [Number.NaN, Number.NaN, Number.NaN]], sol[2] ];
        } else { 
            // CASE 2: t >=0
            const v = normalize(ptc[1]); // normalize v of particle
            const n = math.multiply( rot_90 , math.subtract(w.slice(0,2), w.slice(2,4)) ); // normalize n of wall
            //const v_out =  math.subtract(v, math.multiply(2 * math.dot(n,v), n)); // CHANGE HERE: KERNEL 
            const v_out = reflect(v, n);
            //console.log(v_out);
            return [ [[sol[0], sol[1]], v_out], sol[2] ];
        }

    } catch( err ) {
        // CASE 3: No Solution
        // console.log( 'No SOl' );
        return [ [[Number.NaN, Number.NaN], [Number.NaN, Number.NaN]], -1 ];
    }
}


nextPt = function(pt, v, c=1){
	/*
     * Calculating the next point based on current pos and vector
     */
    
    v = math.multiply(c, v);
	return math.add(pt, v);
}

nextPt2 = function(xv, t){
    /*
     * Calculating the next point at time t
     */
    const x = xv[0];
    const v = xv[1].slice(1, 3);

    x[0] = x[0] + t*v[0];
    x[1] = x[1] + t*v[1];

    return [ [x[0], x[1]], xv[1] ];
}

particle2Wall = function(p, wall){
    /*
     * Calculating the next point at time t
     */
    var sol;
    var ext_wall = p[0];
    
    sol = collide(p, wall);
    if( sol[2] > 0){
        ext_wall = ext_wall.concat(sol.slice(0, 2));   
        //console.log(ext_wall);
        //drawPath(ext_wall.slice(0, 2), ext_wall.slice(2,  4), 'blue', false);
        return ext_wall;
    } else{
        return null
    }
}

drawVector = function(xv, c=1, sc = 'black', draw_root = false){
    /*
     * Draw the path given the current pos and vector
     */
    const x = xv[0];
    const v = xv[1].slice(1, 3);
    //console.log(v); 
    if (draw_root){
        var rt = new Path.Circle(new Point(x[0], x[1]), 3);
        rt.strokeColor = 'green'; // root
    }
	var path =  new Path.Line({
		from: x,
		to:   nextPt(x, v, c),
		strokeColor: sc,
		selected: false
	});	

    return path
}

drawPath = function(start, end, sc = 'blue', draw_root = true, tail_col,sc2){
    /*
     * Draw the path given the current pos and vector
     */
    if (draw_root){
        if(tail_col) var rt = new Path.Circle(new Point(start), 3);
        else var rt = new Path.Circle(new Point(start), 1);
        rt.strokeColor = sc; // root
        rt.fillColor = sc;

        if(tail_col){
            var tail = new Path.Circle(new Point(end), 3);
            tail.strokeColor = tail_col; 
            tail.fillColor = tail_col;
        }
    }
    if(sc2)sc = sc2;
	var path =  new Path.Line({
		from: start,
		to:   end,
		strokeColor: sc,
		selected: false
	});	
	
    return path
}
// MISC function
ptsToEq = function(x0, x1){
    /*
     * convert two points to parametrix array [x, y, t]
     */
    try{
        const m = (x1[1] - x0[1]) / (x1[0] - x0[0]);
        return [ [m, -1, 0], (m*x0[0]- x0[1]) ]
    }
    catch(err){
        // console.log("Undefined slope");
        return [ [1, 0, 0], x0[0] ]
    }
    
}

idxSmallest = function(arr){
    /*
     * Smallest positive index
     */

    var output_idx = [];

    var num, diff;
    
    var pos_arr = arr.filter(function(x){ return x>0 })
    var smallest   = Math.min(...pos_arr);
    
    for ( var idx = 0; idx < arr.length; idx++ ){
        num = arr[idx];    
        if ( (num > 0) && Math.abs(num - smallest) < tol ){
            output_idx.push(idx);
        }
    }

    // console.log(output_idx);
    return output_idx
}

parseCord = function(cord){
    /*
     * Parse coord in the form of (x, y)
     */
	cord = cord.replace(/[\(\)]/g, '');
    cord = cord.split(',');
    return cord.map(parseFloat)
}

/*drawRect_tron = function() {
    envSetup();
    
    initial_vec_path = drawVector(particle, 30, 'red', true);
    
    initial_vec_path_blue = drawVector(particle_blue, 30, 'blue', true);

    //  Initialization
    var red_p = particle.slice();

    var blue_p = particle_blue.slice();

    w = parseInt(document.getElementById('table_width').value);

	var walls = Object.values(wall_lst).map(function(x) {return x[0]});
    
    // DRAW RECTANGLE
    //var walls =[
    //                [-w/2, -h/2, w/2, -h/2],
    //                [w/2, -h/2, w/2, h/2],
    //                [w/2, h/2, -w/2, h/2],
    //                [-w/2, h/2, -w/2, -h/2]
    //             ]

    var s_total = 0

    for(var i = 0; i < walls.length; i++){
        w = walls[i];
        s_total += getDist( w.slice(0, 2), w.slice(2, 4) );
    }

    var draw_walls = walls.map(function(x) {return drawPath(x.slice(0,2), x.slice(2,4), 'grey', false)});
    
    // Initialization
    var v_out_lst, t_col, idx_wall, w, v_in, v_out, bounce, path, start, end;
	
    var path_col = "grey";

	states = [];  //reset states
    st_lst_r = [];
    st_lst_b = [];
    
	// console.log(walls);
    // BEGIN LOOP
    
    var walls_plus_red, walls_plus_blue, red_wall, blue_wall, ext_wall_lst;
    //GOHERE!
    for ( var  lp = 0; lp < num_iter; lp++ ){
        
        walls_plus_red = walls.slice();
        walls_plus_blue = walls.slice();

        for(var i = 0; i < walls.length; i++){
            //console.log(walls[i]);
            var red_wall = particle2Wall(red_p,  walls[i]);
            var blue_wall = particle2Wall(blue_p,  walls[i]);

            if(red_wall!=null){
                walls_plus_red.push(red_wall);
            }
            
            if(blue_wall!=null){
                walls_plus_blue.push(blue_wall);
            }
        } 
        
        // SPLIT UP CASES

        // handle red collisions with walls plus blue
        v_out_lst_red = walls_plus_blue.map(function(wall) {return vectorOut(red_p, wall)});
        t_col_red = v_out_lst_red.map(function(x) {return x[1]});
        
        // Collision time between red particle and blue wall
        var t_rb = t_col_red[t_col_red.length-1] 

        idx_wall_red = idxSmallest(t_col_red);
        t_red = t_col_red[idx_wall_red];

        // handle blue collision with walls plus red
        v_out_lst_blue = walls_plus_red.map(function(wall) {return vectorOut(blue_p, wall)});

        t_col_blue = v_out_lst_blue.map(function(x) {return x[1]});
        // Collision time between blue particle and red wall
        var t_br = t_col_blue[t_col_blue.length-1] 

        idx_wall_blue = idxSmallest(t_col_blue);
        t_blue = t_col_blue[idx_wall_blue];
        
        // Red and blue collision
        
        // WORK ON THIS
        var min_t_rb = t_rb < t_br ? t_rb : t_br
        
        // Alternate
        var alt_rb = false;
        var alt_br = false;

        if(min_t_rb != -1){
            if(min_t_rb == t_red){
                alt_rb = true; 
                t_red  +=t_blue;
            }else if(min_t_rb == t_blue){
                t_blue +=t_red;
                alt_br = true;
            }
        }
        
        // --------------------------------------- 

        //console.log('time ', t_red, ' - ', t_blue, ' - ', alt_rb);

        if(t_red < t_blue){
            if(blue_wall!=null){
                drawPath(blue_wall.slice(0, 2), blue_wall.slice(2, 4), 'blue', false);    

            }
            // HANDLE RED COLLISION // 
            // RED collision happen, use walls plus blue
            w = walls_plus_blue[idx_wall_red[0]];

            v_out_red = vectorOut(red_p, w);

            collision_time = alt_br ? t_blue - t_red: v_out_red[1];
            
            if(alt_br){
                v_out_red[0][1] = red_p[1];
            }
            
            // DRAW
            start = new Point(red_p[0]);
            end = new Point(v_out_red[0][0]);
            
            path_col = 'red'

            path = drawPath(start, end, path_col, true, 'red');
            
            v_out_red[0][0] = nextPt2(red_p, collision_time - tol)[0]; // BACK UP just a tad bit 
            
            // NEW POS
            if ( idx_wall_red.length > 1 ) {
                // Bounce to the corner
                v_out_red[0][1] = math.multiply(-1, red_p[1]);
            }

            red_p = v_out_red[0];


            // HANDLE BLUE PARTICLE //
           start = new Point(blue_p[0]);
           blue_p[0] = nextPt2(blue_p, collision_time)[0];
           end = new Point(blue_p[0]);
            
           path_col = 'blue'

           path = drawPath(start, end, sc=path_col);

            //phase potrait
            var s_wall = 0
            
            if(idx_wall_red < 4){
                for(var i = 0; i < idx_wall_red; i++){
                    s_wall += getDist(walls[i].slice(0, 2), walls[i].slice(2, 4) );
                }
                
                s_wall += getDist(w.slice(0, 2), v_out_red[0][0]);
                
                var p_wall = s_wall/s_total;

                st_lst_r.push([p_wall, cos_theta_out]);
            }

        }else{
            
            if(red_wall!=null){
                drawPath(red_wall.slice(0, 2), red_wall.slice(2, 4), 'red', false);    
            }

            // HANDLE blue COLLISION
            // blue collision happen, use walls plus red 
            w = walls_plus_red[idx_wall_blue[0]];
            
            v_out_blue = vectorOut(blue_p, w);

            collision_time = alt_rb ? t_red - t_blue: v_out_blue[1];

            if(alt_rb){
                v_out_blue[0][1] = blue_p[1];
            }
            
            // DRAW
            start = new Point(blue_p[0]);
            end = new Point(v_out_blue[0][0]);
            
            path_col = 'blue'

            path = drawPath(start, end, path_col, true, 'blue');

            v_out_blue[0][0] = nextPt2( blue_p, collision_time - tol)[0]; // BACK UP just a tad bit 
            
            // NEW POS
            if ( idx_wall_red.length > 1 ) {
                // Bounce to the corner
                v_out_blue[0][1] = math.multiply(-1, blue_p[1]);
            }

            blue_p = v_out_blue[0];


            // HANDLE red PARTICLE //

            start = new Point(red_p[0]);
            red_p[0] = nextPt2(red_p, collision_time)[0];
            end = new Point(red_p[0]);
             
            path_col = 'red'

            path = drawPath(start, end, sc=path_col);
            
            //phase potrait
            var s_wall = 0
            
            if(idx_wall_blue < 4){
                for(var i = 0; i < idx_wall_blue; i++){
                    s_wall += getDist(walls[i].slice(0, 2), walls[i].slice(2, 4) );
                }
                

                s_wall += getDist(w.slice(0, 2), v_out_blue[0][0]);
                
                var p_wall = s_wall/s_total;

                st_lst_b.push([p_wall, cos_theta_out]);
            }
        }
    }
    plotPod_rb(st_lst_r, st_lst_b);
}*/

drawRect = function() {
    envSetup();
    
    w = 400;
    h = 300;
    
    // paper.view.translate(new Point(20, 20));

    // DRAW RECTANGLE
    var walls =[
                    [-w/2, -h/2, w/2, -h/2],
                    [w/2, -h/2, w/2, h/2],
                    [w/2, h/2, -w/2, h/2],
                    [-w/2, h/2, -w/2, -h/2]
                 ]

    var s_total = 0

    for(var i = 0; i < walls.length; i++){
        w = walls[i];
        s_total += getDist( w.slice(0, 2), w.slice(2, 4) );
    }
    

    var draw_walls = walls.map(function(x) {return drawPath(x.slice(0,2), x.slice(2,4), 'black', false)});
    
    // Initialization
    var v_out_lst, t_col, idx_wall, w, v_in, v_out, bounce, path, start, end;
	
    // var path_col = "red";

	states = [];  //reset states
    st_lst = [];
	// console.log(walls);
    // BEGIN LOOP
    for ( var  lp = 0; lp < num_iter; lp++ ){

        v_out_lst = walls.map(function(wall) {return vectorOut(particle, wall)});
        t_col = v_out_lst.map(function(x) {return x[1]});
        // console.log(t_col);
        idx_wall = idxSmallest(t_col);
        w = walls[idx_wall[0]];
        
        v_out = vectorOut(particle, w);

        // DRAW
        start = new Point(particle[0]);
        end = new Point(v_out[0][0])
        
        // path_col = path_col == "red" ? "blue" : "red";
        
        if(lp==0) path = drawPath(start, end, sc='black', true, 'red');
        else if(lp==num_iter-1) path = drawPath(start, end, sc='red', true, 'blue','blue');
        else path = drawPath(start, end, sc='red');

        
        v_out[0][0] = nextPt2( particle, v_out[1] - tol)[0]; // BACK UP just a tad bit 

        // NEW POS
        if ( idx_wall.length > 1 ) {
            // Bounce to the corner
            // v_out[0] = nextPt2( particle, v_out[1] - 3*tol); 
            v_out[0][1] = math.multiply(-1, particle[1]);
        }

        particle = v_out[0];
        var s_wall = 0

        for(var i = 0; i < idx_wall; i++){
            s_wall += getDist( walls[i].slice(0, 2), walls[i].slice(2, 4) );
            
        }


        s_wall += getDist(w.slice(0, 2), v_out[0][0]);
        
        var p_wall = s_wall/s_total;
        

        //GOHERE

		states.push(particle); //append new state
        st_lst.push([p_wall, cos_theta_out]);
    }
    // plotPod(st_lst, []);
}


/*plotPod = function(dat){
    ctx = document.getElementById('chart_canvas').getContext('2d');

	scatterChart = new Chart(ctx, {
	    type: 'scatter',
	    data: {
	        datasets: [{
	            label: 'Phase Potrait',
                data: [],
                backgroundColor: []
	        }]
	    },
	    options: {
	        scales: {
	            xAxes: [{
                    scaleLabel:{
                        display:true,
                        labelString: 's'
                    },
	                type: 'linear',
	                position: 'bottom',
					ticks:{
						max:1,
                        min:0,
                        stepSize: 0.1
					}
	            }],
	            yAxes: [{
                    scaleLabel:{
                        display:true,
                        labelString: 'theta'
                    },
	                type: 'linear',
	                position: 'bottom',
					ticks:{
						max:1.8,
                        min:-1.8,
                        stepSize: 0.5
					}
	            }]
	        }
	    }
	});
    
    scatterChart.data.datasets[0].data = [];

    for(var i=0; i<dat.length; i++){
        var temp = dat[i];
        scatterChart.data.datasets[0].data.push({x: temp[0], y: temp[1]});
    }
    scatterChart.update();
}*/

/*plotPod_rb = function(dat_r, dat_b){
    ctx = document.getElementById('chart_canvas').getContext('2d');
    
    var data_lst = [];
    var data_col_lst = [];

	scatterChart = new Chart(ctx, {
	    type: 'scatter',
	    data: {
	        datasets: [{
	            label: 'Phase Potrait',
                data: data_lst,
                pointBackgroundColor: data_col_lst
	        }]
	    },
	    options: {
	        scales: {
	            xAxes: [{
                    scaleLabel:{
                        display:true,
                        labelString: 's'
                    },
	                type: 'linear',
	                position: 'bottom',
					ticks:{
						max:1,
                        min:0,
                        stepSize: 0.1
					}
	            }],
	            yAxes: [{
                    scaleLabel:{
                        display:true,
                        labelString: 'theta'
                    },
	                type: 'linear',
	                position: 'bottom',
					ticks:{
						max:1.8,
                        min:-1.8,
                        stepSize: 0.5
					}
	            }]
	        }
	    }
	});

    for(var i=0; i<dat_r.length; i++){
        var temp = dat_r[i];
        data_lst.push({x: temp[0], y: temp[1]});
        data_col_lst.push('red');
    }
    
    for(var i=0; i<dat_b.length; i++){
        var temp = dat_b[i];
        data_lst.push({x: temp[0], y: temp[1]});
        data_col_lst.push('blue');
    }

    scatterChart.update();
}*/

circleCollide = function(circle, line){
    
    /*
     *  https://math.stackexchange.com/questions/311921/get-location-of-vector-circle-intersection
     */
    var center = circle[0];
    var r = circle[1];

    var x = line[0];
    var v = line[1].slice(1,3);

    var a = v[0]**2 + v[1]**2;
    var b = 2*( v[0]*(x[0] - center[0]) + v[1]*(x[1] - center[1]) );
    var c = (x[0] - center[0])**2 + (x[1] - center[1])**2 - r**2;

    var delta = b**2 - 4 * a * c;

    if (delta < 0){
        return Number.NaN;
    } else{
        delta = math.sqrt(delta);
        var res =  [(-b - delta) / (2 * a), (-b + delta) / (2 * a)];
        return (res)
    }
}

vecFromPts = function(x, y){
    return math.subtract(y, x);
}


drawCircle = function(){
    envSetup(true);
    
    var r = math.min([window_size])*0.4;

    var circle = [[0, 0], r];
    
    // DRAW CIRCLE
    var cle = new Path.Circle([0, 0], r);
    // cle.removeSegment(0);
     
    cle.strokeColor = 'black';

    var path, t_res, n, start, end, v_out ;
    
    // var path_col = "red";
    // -----------------
	
	states = [];  //reset states

    for (var i = 0; i < num_iter; i++){
    
        t_res = circleCollide(circle, particle);
        t_res = t_res.filter(function(x){return x > 0});
    
        start = new Point(particle[0]);
        end = nextPt2( particle, t_res[0] - tol)[0]; 
        
        // path_col = path_col == "red" ? "blue" : "red";
        
        if(i==0) path = drawPath(start, end, sc='black', true, 'red');
        else if(i==num_iter-1) path = drawPath(start, end, sc='red', true, 'blue','blue');
        else path = drawPath(start, end, sc='red');


        n = normalize(math.subtract(end, circle[0]));
        // FIX THIS PART3
        
        v = normalize(particle[1]);
        //v_out_true = math.dotMultiply([-1, -1], v);

        v_out = reflect(v, n);
        
        /*
        v_out = v_out_true;

        console.log(v_out_true);
        console.log('hi');
        console.log(v_out);
        console.log('bye');
        */ 

        particle = [end, v_out];

		states.push(particle); //append new state
    }
    
}

exportSVG = function(){
    var svg = paper.project.exportSVG({asString: true});
    // console.log(svg);
    var blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
    saveAs(blob, 'billiard.svg');
}


run = function(){
    
    var table_shape = document.querySelector('input[name="table_shape"]:checked').value;
    // console.log("run:",table_shape);

    if (table_shape === 'rectangle'){
        drawRect();
    }else if (table_shape === 'circle'){
        drawCircle();
    }else if (table_shape === 'polygon'){
		drawPoly();
    }
    // else if (table_shape === 'tron'){
	// 	drawRect_tron();
	// }

}

exportStates = function(){
	states = states.map(function(x) {return x.flat()});

	var lineArray = [];
	states.forEach(function (infoArray, index) {
	    var line = infoArray.join(",");
	    lineArray.push(line);
	});
	var csvContent = lineArray.join("\n");
	// console.log(csvContent);
	var blob = new Blob([csvContent], {type: "data:text/csv;charset=utf-8"});
	saveAs(blob, 'states.csv');
}

shiftPt = function(pt, delta){
    return math.add(pt, delta);
}

envSetup = function(dontclean=false){
	//ENVSETUP
    if(!dontclean){
        paper.clear();

        paper.setup('b_table');
    }
	
        // w = parseInt(document.getElementById('table_width').value);
        // h = parseInt(document.getElementById('table_width').value);
        w = 400;
        h = 300;
	
	theta = document.getElementById('theta').value;
	
    initial_position = parseCord(document.getElementById('position').value);

    // initial_position_blue = parseCord(document.getElementById('position_blue').value);
    
    //var min_max = window_size.sort();
    var gamma = parseFloat(document.getElementById('gamma').value);
    ker = no_slip_ker(gamma); // change kernel here

    initial_omega  = parseInt(document.getElementById('omega').value)
    initial_heading  = parseCord(document.getElementById('heading').value);
    
    // initial_omega_blue  = parseInt(document.getElementById('omega_blue').value)
    // initial_heading_blue  = parseCord(document.getElementById('heading_blue').value);

    initial_wv = normalize([initial_omega, initial_heading[0], initial_heading[1]]);

    // initial_wv_blue = normalize([initial_omega_blue, initial_heading_blue[0], initial_heading_blue[1]]);

    particle = [ initial_position, initial_wv];

    // particle_blue = [ initial_position_blue, initial_wv_blue];

    initial_vec_path = drawVector(particle, 30, '#d3d3d3', true);

	slideToVec(theta);	

    num_iter = parseInt(document.getElementById('num_iter').value);

    drawCord();
    
    try{
        scatterChart.destroy();
    }catch(error){
        
    }
}


clearAll = function(){
    paper.clear();
    paper.setup('b_table');

	wall_lst_key = Object.keys(wall_lst);
	for (var i = 0; i < wall_lst_key.length; i++){
		removeWall(wall_lst_key[i]);	
	}
	wall_count = 0;

    envSetup();
	
}

addWall0 = function(pt){
	pt = pt.replace(/[\(\)]/g, '');
	pt = pt.split(',');	

	var start = parseCord(pt.slice(0,2).join(','));
	var end  = parseCord(pt.slice(2,4).join(','));
	var wall_str = "(" + start  + ') - (' + end + ")";
	
	if (pt.length == 4){
		wall_ID = "WalNum" + wall_count;
		wall_count+=1;
		var wall_path = drawPath(start, end, 'black', false);
		wall_lst[wall_ID] = [start.concat(end), wall_path];
		var dropdown_lst = document.getElementById('myDropdown');			   	
		dropdown_lst.innerHTML += "<a href='#' id='" + wall_ID + "' onclick='removeWall(\""+ wall_ID + "\")'>" + wall_str + "</a>";
	}else{console.log("Incorect format");}
	// xxx
}

addWall = function(){
	var pt = prompt("Enter Coordinate (x0, y0), (x1, y1): ");
	if (pt != null && pt != ''){
        addWall0(pt);
		/* pt = pt.replace(/[\(\)]/g, '');
		pt = pt.split(',');	
		var start = parseCord(pt.slice(0,2).join(','));
		var end  = parseCord(pt.slice(2,4).join(','));
        var wall_str = "(" + start  + ') - (' + end + ")";
		// var wall_str2 = "(" + start  + '), (' + end + ")";
		
		if (pt.length == 4){
			wall_ID = "WalNum" + wall_count;
			wall_count+=1;
			var wall_path = drawPath(start, end, 'black', false);
			wall_lst[wall_ID] = [start.concat(end), wall_path];
			var dropdown_lst = document.getElementById('myDropdown');			   	
			dropdown_lst.innerHTML += "<a href='#' id='" + wall_ID + "' onclick='removeWall(\""+ wall_ID + "\")'>" + wall_str + "</a>";
		}else{alert("Incorect format");} */
	}
}

addPoly = function(){
    var pt = prompt("How many walls: ");
    if (pt != null && pt != ''){
        pt = parseInt(pt);
        for (var i = 0; i < pt; i++) {
            addWall();
        }
    }
}

removeWall = function(wall_id){
	
	var remove_wall = document.getElementById(wall_id);
	
	remove_wall.parentNode.removeChild(remove_wall);
	
	var del_wall_path = wall_lst[wall_id][1];
	del_wall_path.removeSegments();
	delete wall_lst[wall_id];
}

drawPoly = function(){

	envSetup();

    // paper.view.translate(new Point(20, 20));
	var walls = Object.values(wall_lst).map(function(x) {return x[0]});
    var draw_walls = walls.map(function(x) {return drawPath(x.slice(0,2), x.slice(2,4), 'black', false)});
    
    // Initialization
    var v_out_lst, t_col, idx_wall, w, v_in, v_out, bounce, path, start, end;
	
	states = [];  //reset states
    // BEGIN LOOP
    for ( var  lp = 0; lp < num_iter; lp++ ){

        v_out_lst = walls.map(function(wall) {return vectorOut(particle, wall)});
        
        t_col = v_out_lst.map(function(x) {return x[1]});

        // console.log(t_col);
        idx_wall = idxSmallest(t_col);
        w = walls[idx_wall[0]];
        v_out = vectorOut(particle, w);

        // DRAW
        start = new Point(particle[0]);
        end = new Point(v_out[0][0])

        if(lp==0) path = drawPath(start, end, sc='black', true, 'red');
        else if(lp==num_iter-1) path = drawPath(start, end, sc='red', true, 'blue','blue');
        else path = drawPath(start, end, sc='red');
        
        v_out[0][0] = nextPt2( particle, v_out[1] - tol)[0]; // BACK UP just a tad bit 

        // NEW POS
        if ( idx_wall.length > 1 ) {
            // Bounce to the corner
            // v_out[0] = nextPt2( particle, v_out[1] - 3*tol); 
            v_out[0][1] = math.multiply(-1, particle[1]);
        }

        particle = v_out[0];
		states.push(particle); //append new state
    }
}

drawCord = function(){
    var w = window_size[0];
    var h = window_size[1];

    var x_axis = drawPath([-w/2, 0], [w/2, 0], '#D3D3D3', false);    
    var y_axis = drawPath([0, -h/2], [0, h/2], '#D3D3D3', false);    
    
    
    paper.view.translate(new Point(w/2, h/2));
    paper.view.scale(1, -1);
}

randint = function(minimum,maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}
addrandtrianglewall = function(minimum=-150,maximum=150){
    clearAll();
    punto1 = randint(minimum,maximum)+', '+randint(minimum,maximum);
    punto2 = randint(minimum,maximum)+', '+randint(minimum,maximum);
    punto3 = randint(minimum,maximum)+', '+randint(minimum,maximum);
    addWall0(punto1+', '+punto2);
    addWall0(punto1+', '+punto3);
    addWall0(punto2+', '+punto3);
}

addRegularPolygon = function(sides=3,radius=150,x=0,y=0) {
    var puntos = [];
    for (var i = 0; i < sides; i++) {
        puntos.push((x + radius * Math.cos(i * 2 * Math.PI / sides))+', '+(y + radius * Math.sin(i * 2 * Math.PI / sides)));
        if(i>0){
            addWall0(puntos[i-1]+', '+puntos[i]);
        }
    }
    // cierra el polígono
    addWall0(puntos[0]+', '+puntos[sides-1]);
}

function addManyWalls(pt,close=false) {
	pt = pt.replace(/[\(\)]/g, '');
	pt = pt.split(',');
    for (let i = 3; i < pt.length; i+=2) {
        addWall0(pt[i-3]+','+pt[i-2]+','+pt[i-1]+','+pt[i]);
    }
    if(close){
        addWall0(pt[pt.length-2]+','+pt[pt.length-1]+','+pt[0]+','+pt[1]);
    }
}

let agregaPared = 0;
let memWall = [];
function setPoint(t,env) {
    // console.log(env,this);
    var rect = t.getBoundingClientRect();
    // console.log(rect.top, rect.right, rect.bottom, rect.left);
    cx = rect.left;
    cy = rect.top-24; // Hack
    rx = env.layerX-cx-(window_size[0]/2);
    ry = (window_size[1]/2)-env.layerY-cy;
    console.log(rx,ry);
    if(agregaPared==1) {
        memWall.push(rx,ry);
        addManyWalls(memWall.join(','),document.getElementById('cerrado').checked);
        agregaPared=0;
        memWall=[];
    }else if(agregaPared>1){
        memWall.push(rx,ry);
        agregaPared--;

    }else document.getElementById('position').value = rx+','+ry;
    run();
}
document.getElementById('b_table').onclick = function (env) {
    setPoint(this,env);
}
window.onload = function() {
  	envSetup();
    // addrandtrianglewall();
    //Equilatero chico
    // addWall0('-97, -56, 97, -56');
    // addWall0('0, 112, 97, -56');
    // addWall0('-97, -56, 0, 112');
    //Equilatero grande
    // addWall0('-194, -112, 194, -112');
    // addWall0('0, 224, 194, -112');
    // addWall0('-194, -112, 0, 224');
    addRegularPolygon(3);
    drawPoly();

}
