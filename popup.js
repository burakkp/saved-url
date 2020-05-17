/*** Google Analytics ***/
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-164702580-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

/*** Google Analytics ***/
  
  var addButton = document.getElementById('addButton');
  var addInput = document.getElementById('itemInput');
  var savedList = document.getElementById('savedList');
  var menuButton = document.querySelector('.menu-btn');
  var listCount = document.getElementById('listCount');
  var listArray = [];
  //declare addToList function

  const capitalize = str =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`

    // console.log(window.navigator.languages[1])
    // console.log(chrome.i18n.getMessage("extName"))

    // document.querySelector('.selected').addEventListener('click', function(){
        
    //     this.classList.toggle('clicked')
    //     document.querySelector('.lang-dropdown').classList.toggle('hide')

    //     document.getElementById('english').addEventListener('click', function(){
    //         document.querySelector('.lang-title').innerHTML = 'English'
    //     })

    //     document.getElementById('dutch').addEventListener('click', function(){
    //         document.querySelector('.lang-title').innerHTML = 'Dutch'
    //     })

    //     document.getElementById('turkish').addEventListener('click', function(){
    //         document.querySelector('.lang-title').innerHTML = 'Turkish' 
    //     })
    // })
  
  function listItemObj(title, url, status) {
      this.title = '';
      this.url = '';
      this.status = 'saved';
  }
  var changeToComp = function(){
      var parent = this.parentElement;
      console.log('Changed to complete');
      parent.className = 'uncompleted well';
      this.innerText = 'Incomplete';
      this.removeEventListener('click',changeToComp);
      this.addEventListener('click',changeToInComp);
      changeListArray(parent.firstChild.innerText,'complete');
  
  }
  
  var changeToInComp = function(){
      var parent = this.parentElement;
      console.log('Changed to incomplete');
      parent.className = 'completed well';
      this.innerText = 'Complete';
      this.removeEventListener('click',changeToInComp);
      this.addEventListener('click',changeToComp);
  
      changeListArray(parent.firstChild.innerText,'saved');
  
  }
  
  var removeItem = function(){
      var parent = this.parentElement.parentElement;
      parent.removeChild(this.parentElement);
    
      //console.log(parent)
      var data = this.parentElement.firstChild.innerText;
      for(var i=0; i < listArray.length; i++){
  
          if(listArray[i].title == data){
              listArray.splice(i,1);
              refreshLocal();
              break;
          }
      }
  
      listCount.innerHTML = listArray.length
  }
  
  //function to change the saved list array
  var changeListArray = function(data,status){
  
      for(var i=0; i < listArray.length; i++){
  
          if(listArray[i].title == data){
              listArray[i].status = status;
              refreshLocal();
              break;
          }
      }
  }
  
  //function to chage the dom of the list of saved list
  var createItemDom = function(text, url, status){
  
      var listItem = document.createElement('li');
  
      var itemLabel = document.createElement('label');

      var itemLink = document.createElement('a');
  
      var itemCompBtn = document.createElement('button');
  
      var itemIncompBtn = document.createElement('div');
  
      listItem.className = 'list-item';
  
      itemLabel.innerText = text;
      itemLink.innerHTML = text;
      itemLink.setAttribute('href', url);
      itemLink.setAttribute('target', 'blank')
       
  
      itemIncompBtn.className = 'btn btn-delete';
      itemIncompBtn.innerHTML = '<span class="icon icon-delete"></span>';
      itemIncompBtn.addEventListener('click',removeItem);
  
      listItem.appendChild(itemLink);
      listItem.appendChild(itemIncompBtn);
  
      return listItem;
  }
  
  var refreshLocal = function(){
      var listArrayURL = listArray;
      localStorage.removeItem('savedList');
      localStorage.setItem('savedList', JSON.stringify(listArrayURL));
  }
  
  var addToList = function(){
      var newItem = new listItemObj();
      
      
      //change the dom
      chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
      }, function(tabs) {
          // and use that tab to fill in out title and url
          var tab = tabs[0];
          // alert(tab.url);
          console.log(tab)
          var item = createItemDom(tab.title, tab.url);
          savedList.appendChild(item);
          newItem.title = tab.title;
          newItem.url = tab.url;          
          listArray.push(newItem);

          listCount.innerHTML = listArray.length;
          
          //addInput.value = '';
          //add to the local storage
          refreshLocal();
          
      });

      //console.log(listArray.length+1)

  }
  
  //function to clear saved list array
  var clearList = function(){
      listArray = [];
      localStorage.removeItem('savedList');
      savedList.innerHTML = '';
  
  }
  
  window.onload = function(){
      var list = localStorage.getItem('savedList');
      
  
      if (list != null) {
          listArrayURL = JSON.parse(list);
          listArray = listArrayURL;
  
          for(var i=0; i<listArray.length;i++){

              var data = listArray[i].title;
  
              var item = createItemDom(data,listArray[i].url);
              savedList.appendChild(item);
          }
          
          listCount.innerHTML = listArray.length

      }
      
  };
  //add an event binder to the button
  addButton.addEventListener('click',addToList);
  //clearButton.addEventListener('click',clearList);
  

  menuButton.onclick = function(){
    
    document.querySelector('.menu-cnt').classList.toggle('hide')

    if(document.querySelector('.menu-cnt').classList.contains('hide')){

      document.querySelector('.menu-btn').classList.remove('icon-Close')
      document.querySelector('.menu-btn').classList.add('icon-Menu')
      //document.querySelector('.menu-btn').children[0].src = 'img/Menu.svg'

    }else{
      document.querySelector('.menu-btn').classList.remove('icon-Menu')
      document.querySelector('.menu-btn').classList.add('icon-Close')
      //document.querySelector('.menu-btn').children[0].src = 'img/Close.svg'

    }

  }
  

  /*** Filter ***/

  var flInput = document.getElementById('itemInput');

  if(localStorage.length > 0){

    var listURLArray = JSON.parse(localStorage.savedList)

    function autocomplete(val) {
        var slist_return = [];
    
        for (i = 0; i < listURLArray.length; i++) {
            
        if (capitalize(val) === listURLArray[i].title.slice(0, val.length)) {
            
            slist_return.push(listURLArray[i]);

        }
        }
        
        return slist_return;
    }


      // events
      flInput.onkeyup = function(e) {
        input_val = this.value; // updates the variable on each ocurrence
        autocomplete_results = document.getElementById("savedList");

        if (input_val.length > 0) {
            var url_to_show = [];
        
            autocomplete_results.innerHTML = '';
            url_to_show = autocomplete(input_val);
            
            for (i = 0; i < url_to_show.length; i++) {
                autocomplete_results.innerHTML += '<li><a href="'+ url_to_show[i].url +'">' +url_to_show[i].title +'</a><div class="btn btn-delete"><span class="icon icon-delete"></span></div></li>';
        
            }
        //autocomplete_results.style.display = 'block';
        } else {

            console.log()
            if(e.code === 'Backspace'){
                window.location.reload()
            }
            
        }
    }


  }
/*** filter end ***/  

/*** Export CSV ***/


function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

document.querySelector('#exportCSV').addEventListener('click', function(){

    var headers = {
        title: 'title', // remove commas to avoid errors
        url: "url"
    };
  
    itemsNotFormatted = JSON.parse(localStorage.savedList)
  
    console.log(itemsNotFormatted)
    var itemsFormatted = [];
  
    // format the data
    itemsNotFormatted.forEach((item) => {
        itemsFormatted.push({
            title: item.title,
            url: item.url
        });
    });
  
    var fileTitle = 'savedURL';
  
    exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download

})

/*** Export CSV End ***/

/*** Import CSV ***/

function csvJSON(csv){

    var lines=csv.split("\n");
  
    var result = [];
  
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }

var importInput = document.getElementById('ImportInput');
    importInput.type = 'file';
    //importInput.click();

    importInput.onchange = e => { 

        // getting a hold of the file reference
        var file = e.target.files[0]; 
     
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
     
        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
           var content = readerEvent.target.result; // this is the content!
           var csvToJSON = JSON.stringify(csvJSON(content));
           //console.log( JSON.stringify(csvJSON(content)) );
           localStorage.setItem('savedList', JSON.parse(csvToJSON))
        }
     
     }

