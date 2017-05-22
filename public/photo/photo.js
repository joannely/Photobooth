var IMG_NO = 0

function enterPhotobooth() {
	document.location.href = 'home.html';
}

function showFileName() {
	var name = document.getElementById('fileSelector'); 
	var fileTitle = document.getElementById('fileChose');
	fileTitle.innerHTML = name.files.item(0).name;
}

function expandMenu(e) {
	if(e.target) {
		e.target.parentElement.getElementsByClassName("menu").style.display = "inline-flex";
		e.target.style.display = "none"		
	}


}

function collapseMenu(e) {
	if(e.target) {
		e.target.parentElement.getElementsByClassName("menuIcon").style.display = "inline-flex";
		e.target.style.display = "none"		
	}

}

function createImg() {
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
	//ct.setAttribute("onclick", changeTags());
	var add = document.createElement("div");
	add.innerHTML = "add to favorites";
	add.setAttribute("class", "menuItem");
	//add.setAttribute("onclick", addFavs());
	var icon = document.createElement("img");
	icon.setAttribute("src", "../photobooth/optionsTriangle.png");
	icon.style.width = "50px";
	icon.style.height = "auto";
	icon.style.alignSelf = "flex-end";
	icon.onclick = collapseMenu;

	// icon.addEventListener("click", function(elm) {
	// 	var elm = event.target || event.srcElement;
	// 	this.parentElement.getElementsByClassName("menuIcon").style.display = "inline-flex";
	// 	this.style.display = "none"	

	// });
	// document.addEventListener("click", function(event){
	//     var targetElement = event.target || event.srcElement;
	//     console.log(targetElement);
	// });
	// icon.setAttribute("onclick", collapseMenu(icon));

	var menuIcon = document.createElement("img");
	menuIcon.setAttribute("src", "../photobooth/optionsTriangle.png");
	menuIcon.setAttribute("class", "menuIcon");
	menuIcon.style.width = "50px";
	menuIcon.style.height = "auto";
	menuIcon.style.alignSelf = "flex-end";
	// menuIcon.addEventListener("click", function(elm) {
	// 	//var elm = event.target || event.srcElement;
	// 	this.parentElement.getElementsByClassName("menu").style.display = "inline-flex";
	// 	this.style.display = "none"	

	// });
	menuIcon.onclick = expandMenu;
	menuIcon.style.display = "none";

	menu.appendChild(ct);
	menu.appendChild(add);
	menu.appendChild(icon);
	menu.style.display = "none";
	// create image 
	var image = document.createElement("IMG");
	image.setAttribute("id", "img" + IMG_NO);
	image.style.width = "250px";
	image.style.height = "auto";
	image.style.zIndex = "0";
	// progress bar
	var progressBar = document.createElement("div");
	progressBar.setAttribute("class", "progressBar");
	// label box
	var labelBox = document.createElement("div");
	labelBox.setAttribute("class", "labelBox")
	labelBox.style.display = "none";

	div.appendChild(container);
	container.appendChild(image);
	container.appendChild(menu);
	container.appendChild(menuIcon);
	div.appendChild(progressBar);
	div.appendChild(labelBox);

	document.getElementById("photos").appendChild(div);
	return image;

}

function uploadFile() {

	if(document.getElementById("fileSelector").value == "") {
		return;
	}

	var image = createImg();
	IMG_NO++;

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
	    image.parentElement.parentElement.getElementsByClassName("labelBox")[0].style.display = "block";
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

function showFavoritesOptions() {
	var div = document.getElementById("favoritesOptions");
	if(div.style.display == "block") {
		div.style.display = "none";
	} else {
		div.style.display = "block";
	}
}