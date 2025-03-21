function changeButton(){
    document.getElementById("editButton").style.visibility = "hidden";
    document.getElementById("updateButton").style.visibility = "visible";

    document.querySelector(".blog-content").style.visibility = "hidden";

    document.querySelector("#contentToEdit").style.visibility = "visible";
};
