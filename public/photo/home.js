var PORT_NO = "10305"

load();

function showFileName() {
	var name = document.getElementById('fileSelector'); 
	var fileTitle = document.getElementById('fileChose');
	fileTitle.innerHTML = name.files.item(0).name;
}

function expandMenu(e) {
	if(e.target) {
		e.target.parentElement.getElementsByClassName("menu")[0].style.display = "inline-flex";
		e.target.style.display = "none";
	}


}

function collapseMenu(e) {
	if(e.target) {
		e.target.parentElement.parentElement.getElementsByClassName("menuIcon")[0].style.display = "inline-flex";
		e.target.parentElement.style.display = "none";
	}
}

function changeTags(e) {
	if(e.target) {
		var labelArea = e.target.parentElement.parentElement.parentElement.getElementsByClassName("labelArea")[0];

		if(labelArea.getElementsByClassName("inputLabel")[0].style.display == "block") {
			labelArea.getElementsByClassName("labelBox")[0].style.backgroundColor = "white";
			var labels = labelArea.firstChild.getElementsByClassName("labelItem");
			for(var i = 0; i < labels.length; i++) {
				labels[i].getElementsByClassName("deleteLabel")[0].style.display = "none"; // BLOCK??
			}				
			
			labelArea.getElementsByClassName("inputLabel")[0].style.display = "none";
			labelArea.getElementsByClassName("addLabelButton")[0].style.display = "none";
		} else {
			labelArea.getElementsByClassName("labelBox")[0].style.backgroundColor = "#C1AB9E";
			var labels = labelArea.firstChild.getElementsByClassName("labelItem");
			for(var i = 0; i < labels.length; i++) {
				labels[i].getElementsByClassName("deleteLabel")[0].style.display = "block"; // BLOCK??
			}
			labelArea.getElementsByClassName("inputLabel")[0].style.display = "block";
			if(labelArea.firstChild.getElementsByClassName("labelItem").length == 10) {
				labelArea.getElementsByClassName("addLabelButton")[0].style.display = "none";
			} else {
				labelArea.getElementsByClassName("addLabelButton")[0].style.display = "block";
			}
		}


	}
}

function delLabel(e) {
	if(e.target) {
		var l = e.target.parentElement.getElementsByClassName("labelText")[0].textContent;
		lString = l.split(' ').join('%'); 
		var imgName = e.target.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("photoContainer")[0].firstChild.id;
		var url = "http://138.68.25.50:"+PORT_NO+"/query?img="+imgName+"&label="+lString+"&op=delete";
		function reqListener() {
			var elm = e.target.parentElement;
			var labelArea = e.target.parentElement.parentElement.parentElement;
			elm.parentNode.removeChild(elm);
			if(labelArea.getElementsByClassName("addLabelButton")[0].style.display == "none") {
				labelArea.getElementsByClassName("addLabelButton")[0].style.display = "block";
			}
		}
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", url);
		oReq.send();
	}
}


function addLabel(e) {
	if(e.target) {
		var l = e.target.parentElement.getElementsByClassName("inputLabel")[0].value;
		lString = l.split(' ').join('%'); 
		var imgName = e.target.parentElement.parentElement.getElementsByClassName("photoContainer")[0].firstChild.id;
		var url = "http://138.68.25.50:"+PORT_NO+"/query?img="+imgName+"&label="+lString+"&op=add";
		function reqListener() {
			e.target.parentElement.getElementsByClassName("inputLabel")[0].value = "";
			var labelBox = e.target.parentElement.firstChild;
			var labelItem = document.createElement("div");
			labelItem.setAttribute("class", "labelItem");
			var deleteLabel = document.createElement("img");
			deleteLabel.setAttribute("class", "deleteLabel");
			deleteLabel.setAttribute("src", "../photobooth/removeTagButton.png");
			deleteLabel.onclick = delLabel;
			var labelText = document.createElement("div");
			labelText.setAttribute("class", "labelText");

			labelItem.appendChild(deleteLabel);
			labelItem.appendChild(labelText);
			labelBox.appendChild(labelItem);
			labelText.textContent = l;

			if(labelBox.getElementsByClassName("labelItem").length == 10) {
				e.target.style.display = "none";
			}			
		}
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", url);
		oReq.send();
	}

}

function addToFavs(e) {
	if(e.target) {
		var imgName = e.target.parentElement.parentElement.firstChild.id;
		var url = "http://138.68.25.50:"+PORT_NO+"/query?img="+imgName+"&op=addToFavs";
		function reqListener() {
			e.target.innerHTML = "unfavorite";
			e.target.onclick = removeFromFavs;
		}
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", url);
		oReq.send();
	}
}

function removeFromFavs(e) {
	if(e.target) {
		var imgName = e.target.parentElement.parentElement.firstChild.id;
		var url = "http://138.68.25.50:"+PORT_NO+"/query?img="+imgName+"&op=deleteFromFavs";
		function reqListener() {
			e.target.innerHTML = "add to favorites";
			e.target.onclick = addToFavs;
		}
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", url);
		oReq.send();
	}
}

function enterFilter() {
	var filter = document.getElementById("filterBox").value;
	var url = "http://138.68.25.50:"+PORT_NO+"/query?keyword="+filter+"&op=filter";
	function reqListener() {
		var data = JSON.parse(this.responseText);
		//alert(temp[0].fileName);
		showPhotos(data);
	}

	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", url);
	oReq.send();


}

function filterFavorites() {
	var div = document.getElementById("favoritesOptions");
	div.style.display = "block";
	var url = "http://138.68.25.50:"+PORT_NO+"/query?op=getFavs";
	function reqListener() {
		var data = JSON.parse(this.responseText);
		//alert(temp[0].fileName);
		showPhotos(data);
	}
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", url);
	oReq.send();
	
}

function load() {
	var url = "http://138.68.25.50:"+PORT_NO+"/query?op=getAll";
	function reqListener() {
		var data = JSON.parse(this.responseText);
		loadPhotos(data);
	}
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", reqListener);
	oReq.open("GET", url);
	oReq.send();
	
}



function clearFilter() {
	document.getElementById("filterBox").value = "";
	var photos = document.getElementsByClassName("photo");
	for(var i = 0; i < photos.length; i++) {
		photos[i].style.display = "block";
	}
}

function clearFavsFilter() {
	var photos = document.getElementsByClassName("photo");
	for(var i = 0; i < photos.length; i++) {
		photos[i].style.display = "block";
	}
	var div = document.getElementById("favoritesOptions");
	div.style.display = "none";
}



function showPhotos(data) {
	console.log("inshowphotos");
	var photos = document.getElementsByClassName("photo");
	for(var i = 0; i < photos.length; i++) {
		photos[i].style.display = "none";
	}
	for(var i = 0; i < photos.length; i++) { // go thru every photo item
		for(var j = 0; j < data.length; j++) { // match with data
			if(photos[i].firstChild.firstChild.id == data[j].fileName) {
				photos[i].style.display = "block";
			}
		}

	}
}

// /* called when image is clicked */
// function getLabels(imgName) {
//         // construct url for query
// 	var url = "http://138.68.25.50:60401/query?img="+imgName;

//         // becomes method of request object oReq
// 	function reqListener () {
//   	    var pgh = document.getElementById("labels");
// 	    pgh.textContent = this.responseText;
// 	}

// 	var oReq = new XMLHttpRequest();
// 	oReq.addEventListener("load", reqListener);
// 	oReq.open("GET", url);
// 	oReq.send();
// }



function loadPhotos(data) {
	for(var i = 0; i < data.length; i++) {
		var img = createImg(data[i].fileName);
		var src = "http://138.68.25.50:"+PORT_NO+"/public/"+data[i].fileName;
		img.setAttribute("src", src);
		var labels = data[i].labels.split(' ');
		for(var i = 0; i < labels.length; i++) {
			var labelBox = img.parentElement.parentElement.getElementsByClassName("labelArea")[0].firstChild;
			var labelItem = document.createElement("div");
			labelItem.setAttribute("class", "labelItem");
			var deleteLabel = document.createElement("img");
			deleteLabel.setAttribute("class", "deleteLabel");
			deleteLabel.setAttribute("src", "../photobooth/removeTagButton.png");
			deleteLabel.onclick = delLabel;
			var labelText = document.createElement("div");
			labelText.setAttribute("class", "labelText");

			labelItem.appendChild(deleteLabel);
			labelItem.appendChild(labelText);
			labelBox.appendChild(labelItem);
			labelText.textContent = labels[i];
			if(labelBox.getElementsByClassName("labelItem").length == 10) {
				e.target.style.display = "none";
			}
		}
		if(data[i].favorite == 1) {
			var elm = img.parentElement.getElementsByClassName("menuItem")[1];
			elm.innerHTML = "unfavorite";
			elm.onclick = removeFromFavs;

		}
	}
}


function createImg(imgName) {
	// create parent div
	var div = document.createElement("div");
	div.setAttribute("class", "photo");

	// create container for img
	var container = document.createElement("div");
	container.setAttribute("class", "photoContainer");
	// create menu
	var menu = document.createElement("div");
	menu.setAttribute("class", "menu");

	var ct = document.createElement("div");
	ct.innerHTML = "change tags";
	ct.setAttribute("class", "menuItem");
	ct.onclick = changeTags;
	//ct.setAttribute("onclick", changeTags());
	var add = document.createElement("div");
	add.innerHTML = "add to favorites";
	add.setAttribute("class", "menuItem");
	add.onclick = addToFavs;
	//add.setAttribute("onclick", addFavs());
	var icon = document.createElement("img");
	icon.setAttribute("src", "../photobooth/optionsTriangle.png");
	icon.style.width = "50px";
	icon.style.height = "auto";
	icon.style.alignSelf = "flex-end";
	icon.onclick = collapseMenu;


	var menuIcon = document.createElement("img");
	menuIcon.setAttribute("src", "../photobooth/optionsTriangle.png");
	menuIcon.setAttribute("class", "menuIcon");
	menuIcon.style.width = "50px";
	menuIcon.style.height = "auto";
	menuIcon.style.alignSelf = "flex-end";
	menuIcon.onclick = expandMenu;
	menuIcon.style.display = "none";

	menu.appendChild(ct);
	menu.appendChild(add);
	menu.appendChild(icon);
	menu.style.display = "none";
	// create image 
	var image = document.createElement("IMG");
	image.setAttribute("id", imgName);
	image.style.width = "250px";
	image.style.height = "auto";
	image.style.zIndex = "0";
	// progress bar
	var progressBar = document.createElement("div");
	progressBar.setAttribute("class", "progressBar");
	// label box
	var labelArea = document.createElement("div");
	labelArea.setAttribute("class", "labelArea");

	var labelBox = document.createElement("div");
	labelBox.setAttribute("class", "labelBox")

	var inputLabel = document.createElement("input");
	inputLabel.setAttribute("class", "inputLabel");
	inputLabel.setAttribute("type", "text");

	var addLabelButton = document.createElement("button");
	addLabelButton.setAttribute("class", "addLabelButton");
	addLabelButton.innerHTML = "Add";
	addLabelButton.onclick = addLabel;

	labelArea.appendChild(labelBox);
	labelArea.appendChild(inputLabel);
	labelArea.appendChild(addLabelButton);
	labelArea.style.display = "none";

	div.appendChild(container);
	container.appendChild(image);
	container.appendChild(menu);
	container.appendChild(menuIcon);
	div.appendChild(progressBar);
	div.appendChild(labelArea);

	document.getElementById("photos").appendChild(div);
	return image;

}

function uploadFile() {

	if(document.getElementById("fileSelector").value == "") {
		return;
	}
	var imgName = document.getElementById("fileChose").innerHTML;
	var image = createImg(imgName);

	document.getElementById('fileChose').innerHTML = "no file chosen";

	var selectedFile = document.getElementById('fileSelector').files[0]; 
	document.getElementById("fileSelector").value = "";

	var formData = new FormData();
	formData.append("userfile", selectedFile);

	var oReq = new XMLHttpRequest();
	oReq.open("POST", '/');
	oReq.onload = function() {
		console.log(oReq.responseText);
	} // equivalent to adding a listener for “load”
	 // which occurs when transfer is complete
	oReq.send(formData); 

	oReq.onreadystatechange = function() { // done uploading
	    image.style.opacity = 1;
	    image.parentElement.parentElement.getElementsByClassName("progressBar")[0].style.display = "none";
	    image.parentElement.parentElement.getElementsByClassName("labelArea")[0].style.display = "block";
	    image.parentElement.parentElement.getElementsByClassName("labelArea")[0].getElementsByClassName("inputLabel")[0].style.display = "none";
	    image.parentElement.parentElement.getElementsByClassName("labelArea")[0].getElementsByClassName("addLabelButton")[0].style.display = "none";

	    image.parentElement.getElementsByClassName("menuIcon")[0].style.display = "inline-flex";

	}

	//document.getElementById("photos").appendChild(image);
	var fr = new FileReader();
	fr.onload = function() {
		image.setAttribute("src", fr.result);
		image.style.opacity = 0.5;
	}
	fr.readAsDataURL(selectedFile);
}


function showUploadOptions() {
	var div = document.getElementById("uploadOptions");
	if(div.style.display == "block") {
		div.style.display = "none";
	} else {
		div.style.display = "block";
	}
}

function showFilterOptions() {
	var div = document.getElementById("filterOptions");
	if(div.style.display == "block") {
		div.style.display = "none";
	} else {
		div.style.display = "block";
	}
}