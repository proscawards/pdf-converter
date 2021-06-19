var data;
//Set file url
function setData(data){data = data;}

//Display filename
$("#uploadFile").change(function() {
    if ($("#uploadFile")[0].files[0]){
        var file = $("#uploadFile")[0].files[0].name;
        $("#uploadSpan").text(file);
        $("#uploadIcon").removeClass("fa-file-upload");
        $("#uploadIcon").addClass("fa-file-pdf");
    }
    else{
        $("#uploadSpan").text("Upload File");
        $("#uploadIcon").attr("class", "");
        $("#uploadIcon").addClass("fas fa-file-upload");
    }
});

//Check if the file uploaded is PDF
$("#convertBtn").click(function (e){
    e.preventDefault();
    var filename = $("#uploadFile").val().split('.').pop().toUpperCase(); 
    var file = $("#uploadFile").val();

    if (file == ""){
        Swal.fire({
            icon: 'warning',
            title: "No file is uploaded!<br/> Please try again.",
            html: "<bold>Supported file type: </bold> PDF"
        })
    }
    else if (filename !== "PDF"){
        Swal.fire({
            icon: 'warning',
            title: "File uploaded is not supported!<br/> Please try again.",
            html: "<bold>Supported file type: </bold> PDF<br/> Currently uploaded file type: <span style='color:red;'>"+filename+"</span>"
        })
        $(this).removeClass("is-success");
        $(this).addClass("is-danger");
    }
    else{
        //Clear state (success/danger)
        $(this).attr("class", "");
        $(this).addClass("button is-primary is-loading");

        //Start Conversion
        var formData = new FormData();
        var inputFile = document.getElementById("uploadFile").files[0];
        //Adding required parameters
        formData.append("inputFile", inputFile);
        formData.append("outputFormat", "docx");
        formData.append("conversionParameters", "{}");
        formData.append("async", "false");
        var request = new XMLHttpRequest();
        request.open('POST', 'https://api2.docconversionapi.com/jobs/create', true);
        request.responseType = 'json';
        //Please, paste your AppId and SecretKey values here
        request.setRequestHeader("X-ApplicationID", process.env.APP_ID);
        request.setRequestHeader("X-SecretKey", process.env.APP_KEY);
        request.onload = function () {
            if (request.status == 200) {
                console.log(request.response);
                data = request.response;
                setData(data);
                $("#saveBtn").show();
                $("#resetBtn").show();
                $("#uploadBtn").hide();
                $("#convertBtn").hide();
            }
        }
        request.send(formData);
    }
});

//Save file
$("#saveBtn").click(function (e){
    e.preventDefault();
    saveAs(data.fileDownloadUrl, data.fileName);
});

//Reset
$("#resetBtn").click(function (e){
    e.preventDefault();
    //Reset state
    $("#uploadFile").val("");
    $("#uploadSpan").text("Upload File");
    $("#uploadIcon").removeClass("fa-file-pdf");
    $("#uploadIcon").addClass("fa-file-upload");
    $("#convertBtn").attr("class", "")
    $("#convertBtn").addClass("button is-primary");

    $("#saveBtn").hide();
    $("#resetBtn").hide();
    $("#uploadBtn").show();
    $("#convertBtn").show();
});