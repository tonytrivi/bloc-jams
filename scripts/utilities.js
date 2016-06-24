function forEach(items, callback) {
    for(i = 0; i < items.length; i++){
        callback(i);
    }
    
    
}

//testing forEach
//function myCallback(item) {
//    console.log(item);
//}

//var testArray = [1,2,3,4];
//forEach(testArray, myCallback); 