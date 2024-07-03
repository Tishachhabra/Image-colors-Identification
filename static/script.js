// Updates the thumbnail of the uploaded file
function updateThumbnail(dropZoneElement, file) {
    const dropZoneContainer = document.getElementById('drop-zone');
    const uploadedContainer = document.getElementById('uploaded-container');
    const thumbnailElement = document.getElementById('uploaded-image');
    const filenameElement = document.getElementById('uploaded-filename');
    const processbut = document.getElementById('process-button');

    // Remove the drop zone
    dropZoneContainer.style.display = 'none';

    // Display the uploaded container
    uploadedContainer.style.display = 'block';

    // Display the process button
    processbut.style.display = 'block';

    // Show thumbnail for uploaded image
    if (file.type.startsWith("image/")) {                   //Checks if the uploaded file is an image
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.src = reader.result;
            filenameElement.textContent = file.name;                //Show File name
        };
    }
}

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    // When the drop zone is clicked, trigger the hidden file input click
    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    // When the file input changes (i.e., a file is selected), update the centre zone
    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    // When a file is dragged over the drop zone, add styling
    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    // When the drag leaves the drop zone or ends, remove the added styles
    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    // When a file is dropped into the drop zone, update the file input and the thumbnail
    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

// Process button functionality to send the uploaded file to the backend for analysis
document.getElementById("process-button").addEventListener("click", function () {
    const fileInput = document.getElementById("image-input");

    // Check if a file has been uploaded
    if (fileInput.files.length === 0) {
        alert("Please upload an image first.");
        return;
    }

    // Create a FormData object to hold the uploaded file
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    // Send the file to the backend endpoint for analysis
    fetch('http://127.0.0.1:5500/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) 
    .then(data => {
        console.log(data); 
        alert("Image processed successfully!");
    })
    .catch(error => {
        console.error("Error:", error); 
    });
});
