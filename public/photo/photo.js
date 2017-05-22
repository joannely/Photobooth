var IMG_NO = 0

function enterPhotobooth() {
	document.location.href = 'home.html';
}

function showFileName() {
	var name = document.getElementById('fileSelector'); 
	var fileTitle = document.getElementById('fileChose');
	fileTitle.innerHTML = name.files.item(0).name;
}

function createImg() {
	// create parent div
	var div = document.createElement("div");
	div.setAttribute("class", "photo")

	// create image 
	var image = document.createElement("IMG");
	image.setAttribute("id", "img" + IMG_NO);
	image.style.width = "200px";
	image.style.height = "auto";
	// progress bar
	var progressBar = document.createElement("div");
	progressBar.setAttribute("class", "progressBar");
	// label box
	var labelBox = document.createElement("div");
	labelBox.setAttribute("class", "labelBox")
	labelBox.setAttribute("onClick", "labelBoxClicked()");
	labelBox.style.display = "none";

	div.appendChild(image);
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
	    image.parentElement.getElementsByClassName("progressBar")[0].style.display = "none";
	    image.parentElement.getElementsByClassName("labelBox")[0].style.display = "block";

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