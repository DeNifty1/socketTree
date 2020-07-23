var myTree = Array(); // Global to be used across functions

/**
 * Websocket Code
 */
var websocket = new WebSocket("ws://localhost:9999"); 
websocket.onopen = function(e) {
    console.log('Connected');
}; 
websocket.onclose = function(e) {
    console.log('Disonnected');
}; 
websocket.onmessage = function(e) {
    //console.log('growTree:'+ JSON.parse(e.data));
    console.log(JSON.parse(e.data));
    myTree = JSON.parse(e.data);
    growTree();
};
websocket.onerror = function(e) {
    console.log('Error '+ e.data);
};

/**
 * submitBranch - Checks for valid input then submits to the socket
 */
function submitBranch(){
    // validate input
    if (validate() ){
        // If for some reason input gets by validator force input to integer values
        var numOfLeaves = parseInt (document.getElementById('itemNum').value, 10);
        var minLeafSize = parseInt (document.getElementById('lowerNum').value, 10);
        var maxLeafSize = parseInt (document.getElementById('upperNum').value, 10);
        var leavesArray = Array();
        //console.log('minLeafSize:' + minLeafSize + '  maxLeafSize:' + maxLeafSize)
        for (var i = 1; i <= numOfLeaves ; ++i) {
            randNum = Math.floor(Math.random() * (maxLeafSize - minLeafSize + 1)) + minLeafSize;
            leavesArray.push ( randNum );   
        }
        var branch = {
            branchName: document.getElementById('branchName').value,
            lowerNum: minLeafSize,
            upperNum: maxLeafSize,
            itemNum: numOfLeaves,
            leaves: leavesArray
        };
                    
        // Check to see if we are adding or editing
        if (document.getElementById('element').value == 'null') {
            // Adding to the tree
            myTree.push(branch);    
        } else {
            // Editing the tree
            myTree[document.getElementById('element').value] = branch;
        }
        resetBranch()
        websocket.send(JSON.stringify(myTree));
        growTree();
    }
}

/**
 * resetBranch - resets html styles back to before any editing
 */
function resetBranch(){
    //document.getElementById('mode').innerHTML = 'Add';
    document.getElementById('branchSubmit').innerHTML = 'Create';
    if (document.getElementById('element').value != 'null') {
        document.getElementById('branch' + document.getElementById('element').value).style.backgroundColor = "#ffffff";
        document.getElementById('element').value = 'null';
    }
    //document.getElementById('cancel').style.visibility = "hidden";
    document.getElementById('header').style.backgroundColor = "#ccc";
    document.getElementById('errorMessage').innerHTML = '';

    document.getElementById('branchName').value = '';
    document.getElementById('itemNum').value = '';
    document.getElementById('lowerNum').value = '';
    document.getElementById('upperNum').value = '';
}

/**
 * editBranch - changes formatting so the user can see which branch they are editing
 */
 function editBranch(element){
    //document.getElementById('mode').innerHTML = 'Edit';
    document.getElementById('branchSubmit').innerHTML = 'Save';
    //document.getElementById('cancel').style.visibility = "visible";
    // whiteout previousHighlight 
    if (document.getElementById('element').value != 'null') {
        document.getElementById('branch' + document.getElementById('element').value).style.backgroundColor = "#ffffff";
    }
    document.getElementById('branch' + element).style.backgroundColor = "#99ff99";
    document.getElementById('header').style.backgroundColor = "#99ff99";
    document.getElementById('branchName').value = myTree[element].branchName.toString();
    document.getElementById('itemNum').value = myTree[element].itemNum;
    document.getElementById('lowerNum').value = myTree[element].lowerNum;
    document.getElementById('upperNum').value = myTree[element].upperNum;
    document.getElementById('element').value = element;
}


/**
 * deleteBranch - sets the element equal to null in case someone else is editing...if the edit is saved it puts the branch back
 */
 function deleteBranch(element){
     delete myTree[element]; // deleting element will allow edits to not error out
     resetBranch(); 
     websocket.send(JSON.stringify(myTree));
     growTree();
}

/**
 * growTree - this is where the magic happens...tree is rebuilt to show current tree
 */
 function growTree(){
    console.log(myTree);
    var tree = document.getElementById('content');
    tree.innerHTML = '';
    console.log("myTree.length: " + myTree.length);
    for (var i = 0; i < myTree.length; ++i){ // Build from top down
    // for (var i = myTree.length-1; i>=0; --i){ // Build from bottom up
        if (myTree[i] != undefined){  // check to see if branch was deleted
            var leaves ='';
            for (var a = 0; a < myTree[i].leaves.length; ++a){
                leaves += '<div class="row">';
                // main Branch HTML
                if ( i != (myTree.length-1)){
                    leaves += '<image src="images/vert.png">';
                } else {
                    leaves += '<image src="images/space.png">';
                }
                // Branch HTML
                if (a != (myTree[i].leaves.length-1)) {
                    leaves += '<image src="images/int.png">';
                } else {
                    leaves += '<image src="images/bottom.png">';
                }
                leaves += '<span class="items">' + myTree[i].leaves[a].toString() + '</span></div>';
             }
               
            // Determine first images to show
            var branchImage;
            if ( i == (myTree.length-1)){
                branchImage = '<image src="images/bottom.png">';
            } else {
                branchImage = '<image src="images/int.png">';
            }
            //console.log("leaves: " + leaves);
            tree.innerHTML += '<div id="branch' + i +'" class="row">' + branchImage +
                '<span class="items">' + myTree[i].branchName.toString() + ' : ' +  myTree[i].lowerNum.toString() + ' to ' +myTree[i].upperNum.toString() + 
                '</span> <button onclick="editBranch(' + i + ')">Edit</button>' +
                '<button onclick="deleteBranch(' + i + ')">Delete</button>' + '</div>' + leaves;
        }
    }
}

/**
 * validate - validates
 */
 function validate(){
    var branchName = document.getElementById('branchName').value;
    if ( branchName == '' ){
        document.getElementById('errorMessage').innerHTML = 'Enter a name';
        document.getElementById('header').style.backgroundColor = "#f99";
        return false;
    }
    var minLeafSize = parseInt (document.getElementById('lowerNum').value, 10);
    if ( isNaN(minLeafSize) ){
        document.getElementById('errorMessage').innerHTML = 'Enter a number in the range';
        document.getElementById('header').style.backgroundColor = "#f99";
        return false;
    }
    var maxLeafSize = parseInt (document.getElementById('upperNum').value, 10);
    if ( isNaN(maxLeafSize) ){
        document.getElementById('errorMessage').innerHTML = 'Enter a number in the range';
        document.getElementById('header').style.backgroundColor = "#f99";
        return false;
    }
    var numOfLeaves = parseInt (document.getElementById('itemNum').value, 10);
    if ( isNaN(numOfLeaves) || numOfLeaves >15 || numOfLeaves < 1  ){
        document.getElementById('errorMessage').innerHTML = 'Enter a number between 1-15';
        document.getElementById('header').style.backgroundColor = "#f99";
        return false;
    }
    return true;    
}
