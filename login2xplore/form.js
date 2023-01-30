
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var projectRelation = 'Project-Table';
var projectDatabase ="Project-Db";
var connToken = "90932253|-31949276928046554|90954404";



$('#proid').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getEmpIdAsJsonObj(){
    var proid = $('#proid').val();
    var jsonStr = {
        proid:proid 
    };
    return JSON.stringify(jsonStr);
}

function putDataFilled(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#proname').val(record.name);
    $('#assignto').val(record.class);
    $('#assigndate').val(record.assigndate);
    $('#deadline').val(record.deadline);
    
}

function resetData(){
    $('#proid').val("");
    $('#proname').val("");
    $('#assignto').val("");
    $('#assigndate').val("");
    $('#deadline').val("");
    $('#proid').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#edit').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#proid').focus();
}

function validateData() {
    var proid , proname, assignto, assigndate, deadline;
    proid = $("#proid").val();
    proname = $("#proname").val();
    assignto = $("#assignto").val();
    assigndate = $("#assigndate").val();
    deadline = $("#deadline").val();

    if (proid === "") {
        alert('Fill Project Id');
        $("#proid").focus();
        return "";
    }
    if (proname === "") {
        alert('Fill Project Name');
        $("#proname").focus();
        return "";
    }
    if (assignto === "") {
        alert('Fill Assigned To');
        $("#assignto").focus();
        return "";
    }
    if (assigndate === "") {
        alert('Fill Assigned Date');
        $("#assigndate").focus();
        return "";
    }
    if (deadline === "") {
        alert('Fill The Deadline Feild');
        $("#deadline").focus();
        return "";
    }

    var jsonStringObj = {
        proid: proid,
        name: proname,
        class: assignto,
        assigndate: assigndate,
        deadline: deadline,
    };
    return JSON.stringify(jsonStringObj);

}

function getPro() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projectDatabase, projectRelation,empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    $('#save').prop('disabled', false);
    if (resJsonObj.status === 400) {
        $('#reset').prop('disabled', false);
        $('#save').prop('disabled', false);
        $('#proname').focus();
    }else if (resJsonObj.status === 200){
        $("#proid").prop('disabled', true);
        putDataFilled(resJsonObj);
        $('#reset').prop('disabled', false);
        $('#edit').prop('disabled', false);
        $('#proname').focus();
    }
}

function saveData() {
    var jsonStringObj = validateData();
    if (jsonStringObj === ''){
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStringObj,projectDatabase,projectRelation);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetData();
    $('#proid').focus();
}

function editData() {
    $('#edit').prop('disabled', true);
    jsonObj = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonObj,projectDatabase,projectRelation, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    $('#edit').prop('disabled', false);
    resetData();

    $('#proid').focus();
}