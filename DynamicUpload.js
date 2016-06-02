(function($){
	
    $.fn.dynamicUpload = function(){

            if(arguments.length == 2)
            {
                    var firstArg = arguments[0];

                    var invokedFunc;
                    var invokedFuncArgArray;

                    if(firstArg === "uploadQueueHead")
                    {
                            invokedFunc = uploadQueueHead;
                            invokedFuncArgArray = [arguments[1]];
                    }
                    else if(firstArg === "removeQueueElement")
                    {
                            invokedFunc = removeQueueElement;
                            invokedFuncArgArray = [arguments[1]];
                    }
                    else
                    {
                            invokedFunc = create;
                            invokedFuncArgArray = arguments;
                    }

                    if(!!invokedFunc)
                            return invokedFunc.apply(this, invokedFuncArgArray);
            }


            function internalUploadQueueHead(du$formQueue, uploadFile, doAfterQueuePop)
            {
                    if(doAfterQueuePop)
                    {
                            var formerHead$Form = du$formQueue.shift();

                            if(!!formerHead$Form)
                                    formerHead$Form.remove();
                    }

                    if(du$formQueue.length > 0)
                            uploadFile(du$formQueue[0]);
            }

            function uploadQueueHead(doAfterQueuePop)
            {
                    var publicAssetsObj = $(this).data("dynamicUpload.publicAssetsObj");
                    internalUploadQueueHead(publicAssetsObj.du$formQueue, publicAssetsObj.uploadFile, doAfterQueuePop);
            }


            function removeQueueElement(fileOrdinal)
            {
                    var du$formQueue = $(this).data("dynamicUpload.publicAssetsObj").du$formQueue;

                    du$formQueue[fileOrdinal].remove();
                    du$formQueue.splice(fileOrdinal, 1);
            }

            function create(uploadStartElementRepObj, argOptionsObj)
            {
                    var optionsObj = {
                            doSetupModernFileSelectionModule: true,
                            doSetupModernUploadModule: true,

                            uploadFormTypeClass: "dynamicUploadForms",
                            uploadFormFileInputClass: "dynamicUploadFormFileInputs",
                            uploadFormFileInputName: "Filedata",
                            uploadFormHiddenInputNameToValueObj: {},
                            uploadFormAction: "",

                            uploadIframeHandle: "dynamicUploadIframe",
                            acceptedFileExtensionArray: [],

                            uploadFile: defaultUploadFile,

                            onFileSelectSuccess: null,
                            onFileSelectFailure: null,

                            beforeFileUploadStart: null,
                            afterFileUploadEnd: null
                    };

                    var du$formQueue;

                    var $uploadIframeObj;

                    var $uploadStartButton;
                    var doesUploadStartElementExist;

                    var publicAssetsObj;

                    if(this.length > 0)
                    {
                            $.extend(true, optionsObj, argOptionsObj);

                            du$formQueue = [];

                            $uploadIframeObj = (!optionsObj.doSetupModernUploadModule ? setupUploadIframe() : null);

                            $uploadStartButton = $(uploadStartElementRepObj);
                            doesUploadStartElementExist = ($uploadStartButton.length > 0);

                            publicAssetsObj = {"du$formQueue": du$formQueue, uploadFile: optionsObj.uploadFile};

                            if(doesUploadStartElementExist)
                                    prepareUploadStartElement();

                            this.each(function(){
                                    var $fileSelectionElementObj = $(this);

                                    prepareFileSelectionElement($fileSelectionElementObj)
                                    engageFileSelectionElement($fileSelectionElementObj);
                            });
                    }

                    return this;

                    function defaultOnFileUploadEnd(responseObj, textStatus)
                    {
                            var canAdvance = (optionsObj.afterFileUploadEnd instanceof Function ? optionsObj.afterFileUploadEnd(responseObj, textStatus) : true);

                            if(canAdvance)
                                    internalUploadQueueHead(du$formQueue, optionsObj.uploadFile, true);
                    }


                    function setupUploadIframe()
                    {
                            function getIframe$PageObj()
                            {
                                    var $pageObj;

                                    try
                                    {
                                            $pageObj = $uploadIframeObj.contents().find("html");
                                    }
                                    catch(error)
                                    {
                                            $pageObj = $();
                                    }

                                    return $pageObj;
                            }

                            var uploadIframeHandle = optionsObj.uploadIframeHandle;

                            var uploadIframeHTML = "<iframe id='" + uploadIframeHandle +"' name='" + uploadIframeHandle + "' style='display:none;'/>";

                            var $localUploadIframeObj = $("body").append(uploadIframeHTML).children().last();

                            $localUploadIframeObj.load(function(){
                                    defaultOnFileUploadEnd(getIframe$PageObj());
                            });

                            return $localUploadIframeObj;
                    }



                    function defaultModernUploadFile($formObj)
                    {
                            function onSuccess(data, textStatus, jqXHR)
                            {
                                    defaultOnFileUploadEnd(data, textStatus);
                            }

                            function onError(jqXHR, textStatus, errorThrown)
                            {
                                    defaultOnFileUploadEnd(errorThrown, textStatus);
                            }

                            if(optionsObj.beforeFileUploadStart instanceof Function)
                                    optionsObj.beforeFileUploadStart($formObj);


                            $.ajax({
                                    data: new FormData($formObj[0]),
                                    method: "POST",

                                    //When form data is to be sent by the $.ajax method, the processData and contentType
                                    //options must both be set to false in order for the data to be sent, and sent properly 
                                    //(for more information, see http://stackoverflow.com/a/5976031/468737) 
                                    processData: false,					//prevents jQuery from transforming the data in to a query string
                                    contentType: false,					//prevents jQuery from setting the content-type (it does so incorrectly)
                                    /////

                                    success: onSuccess,
                                    error: onError
                            });
                    }

                    function defaultLegacyUploadFile($formObj)
                    {
                            if(optionsObj.beforeFileUploadStart instanceof Function)
                                    optionsObj.beforeFileUploadStart($formObj);

                            $uploadIframeObj.html("");
                            $formObj.submit();
                    }

                    function defaultUploadFile($formObj)
                    {
                            if(optionsObj.doSetupModernUploadModule)
                                    defaultModernUploadFile($formObj);
                            else
                                    defaultLegacyUploadFile($formObj);
                    }

                    function affixPublicAssetsTo($dynamicUploadElementObj)
                    {
                            $dynamicUploadElementObj.data("dynamicUpload.publicAssetsObj", publicAssetsObj);
                    }

                    function prepareUploadStartElement()
                    {
                            $uploadStartButton.click(function(event){internalUploadQueueHead(du$formQueue, optionsObj.uploadFile, false);});
                            affixPublicAssetsTo($uploadStartButton);
                    }

                    function prepareFileSelectionElement($fileSelectionElementObj)
                    {
                            affixPublicAssetsTo($fileSelectionElementObj);
                    }

                    function createStyleAttributeValue(styleDataObj)
                    {
                            var valueStr = "";

                            for(var key in styleDataObj)
                                    valueStr += key + ":" + styleDataObj[key] + ";";

                            return valueStr;
                    }

                    function createFormHiddenInputSequenceHTMLText(uploadFormHiddenInputNameToValueObj)
                    {
                            var htmlText = "";

                            for(var name in optionsObj.uploadFormHiddenInputNameToValueObj)
                                    htmlText += "<input name='" + name + "' value='" + uploadFormHiddenInputNameToValueObj[name] + "' type='hidden'/>";

                            return htmlText;
                    }

                    function createFormHTMLText(formStyleDataObj, fileInputStyleDataObj)
                    {
                            //Create the form with only one element: a file input. CSS for the form's class and file input field class make them
                            //not visible and positions the "choose" button on top the button identified by "uploadButtonID"

                            var formStyleAttributeValue = createStyleAttributeValue(formStyleDataObj);
                            var fileInputStyleAttributeValue = createStyleAttributeValue(fileInputStyleDataObj);

                            var regularUploadFormHTMLText =
                                    "<form class='" + optionsObj.uploadFormTypeClass + "' target='" + optionsObj.uploadIframeHandle + "' method='post' enctype='multipart/form-data' action='" + optionsObj.uploadFormAction + "' style='" + formStyleAttributeValue + "'>"
                                            + "<input class='" + optionsObj.uploadFormFileInputClass + "' name='" + optionsObj.uploadFormFileInputName + "' type='file' style='" + fileInputStyleAttributeValue + "'/>"
                                            + createFormHiddenInputSequenceHTMLText(optionsObj.uploadFormHiddenInputNameToValueObj)
                                    + "</form>";

                            return regularUploadFormHTMLText;
                    }

                    function handleFileSelection($fileInputObj, $fileSelectionElementObj)
                    {
                            var filePath = $fileInputObj.val();
                            var standardizedFilePath = filePath.replace(/\\/g,"/");

                            var fileName = standardizedFilePath.substring(standardizedFilePath.lastIndexOf("/") + 1);
                            var fileExtension = "*" + fileName.substring(fileName.lastIndexOf(".")).toLowerCase();

                            if($.inArray(fileExtension, optionsObj.acceptedFileExtensionArray) != -1)
                            {
                                    var $fileInputFormObj = $fileInputObj.parent();
                                    reengageFileSelectionElement($fileSelectionElementObj, $fileInputFormObj);

                                    if(optionsObj.onFileSelectSuccess instanceof Function)
                                            optionsObj.onFileSelectSuccess(fileName, fileExtension, du$formQueue.length - 1);

                                    if(!doesUploadStartElementExist)
                                            optionsObj.uploadFile($fileInputFormObj);
                            }
                            else
                            {
                                    $fileInputObj.val("");                                                                        //clears the file input field (rejects the file for uploading)

                                    if(optionsObj.onFileSelectFailure instanceof Function)
                                            optionsObj.onFileSelectFailure(fileName, fileExtension, acceptedFileExtensionArray);
                            }
                    }

                    function performModernFileSelectionElementEngagement($fileSelectionElementObj)
                    {
                            var formStyleDataObj = {
                                    "position": "absolute",

                                    "left": -99999 + "px",
                                    "top": -99999 + "px",

                                    "width": "1px",
                                    "height":  "1px",

                                    "overflow": "hidden",
                                    "opacity": "0"
                            };

                            var fileInputStyleDataObj = {
                                    "width": "inherit",
                                    "height": "inherit"
                            };

                            var $formObj = $(createFormHTMLText(formStyleDataObj, fileInputStyleDataObj));
                            var $fileInputObj = $formObj.children("." + optionsObj.uploadFormFileInputClass);

                            $("body").append($formObj);

                            $fileSelectionElementObj
                                    .off("click.dynamicUpload")
                                    .on("click.dynamicUpload", function(event){$fileInputObj.click()});

                            $fileInputObj.change(function(){handleFileSelection($fileInputObj, $fileSelectionElementObj)});
                    }

                    function performLegacyFileSelectionElementEngagement($fileSelectionElementObj)
                    {
                            var fileSelectionElementZIndexValue = $fileSelectionElementObj.css("zIndex");
                            var formZIndexValue = (fileSelectionElementZIndexValue instanceof Number ? fileSelectionElementZIndexValue + 1 : 1);

                            var formStyleDataObj = {
                                    "position": $fileSelectionElementObj.css("position"),

                                    "left": $fileSelectionElementObj.css("left"),
                                    "top": $fileSelectionElementObj.css("top"),
                                    "z-index": formZIndexValue,

                                    "-moz-border-top-left-radius" : $fileSelectionElementObj.css("-moz-border-top-left-radius"),
                                    "-moz-border-top-right-radius" : $fileSelectionElementObj.css("-moz-border-top-right-radius"),
                                    "-moz-border-bottom-right-radius" : $fileSelectionElementObj.css("-moz-border-bottom-right-radius"),
                                    "-moz-border-bottom-left-radius" : $fileSelectionElementObj.css("-moz-border-bottom-left-radius"),

                                    "-webkit-border-top-left-radius" : $fileSelectionElementObj.css("-webkit-border-top-left-radius"),
                                    "-webkit-border-top-right-radius" : $fileSelectionElementObj.css("-webkit-border-top-right-radius"),
                                    "-webkit-border-bottom-right-radius" : $fileSelectionElementObj.css("-webkit-border-bottom-right-radius"),
                                    "-webkit-border-bottom-left-radius" : $fileSelectionElementObj.css("-webkit-border-bottom-left-radius"),

                                    "border-top-left-radius" : $fileSelectionElementObj.css("border-top-left-radius"),
                                    "border-top-right-radius" : $fileSelectionElementObj.css("border-top-right-radius"),
                                    "border-bottom-right-radius" : $fileSelectionElementObj.css("border-bottom-right-radius"),
                                    "border-bottom-left-radius" : $fileSelectionElementObj.css("border-bottom-left-radius"),

                                    "width": $fileSelectionElementObj.outerWidth(false) + "px",
                                    "min-width": $fileSelectionElementObj.css("min-width"),
                                    "max-width": $fileSelectionElementObj.css("max-width"),

                                    "height": $fileSelectionElementObj.outerHeight(false) + "px",
                                    "min-height": $fileSelectionElementObj.css("min-height"),
                                    "max-height": $fileSelectionElementObj.css("max-height"),

                                    "margin-top": $fileSelectionElementObj.css("margin-top"),
                                    "margin-bottom": $fileSelectionElementObj.css("margin-bottom"),
                                    "margin-right": $fileSelectionElementObj.css("margin-right"),
                                    "margin-left": $fileSelectionElementObj.css("margin-left"),

                                    "overflow": "hidden",
                                    "opacity": "0"
                            };

                            var fileInputStyleDataObj = {
                                    "width": "inherit",
                                    "min-width": "inherit",
                                    "max-width": "inherit",

                                    "height": "inherit",
                                    "min-height": "inherit",
                                    "max-height": "inherit"
                            };

                            var $formObj = $(createFormHTMLText(formStyleDataObj, fileInputStyleDataObj));
                            var $fileInputObj = $formObj.children("." + optionsObj.uploadFormFileInputClass);

                            $fileSelectionElementObj.before($formObj);

                            $fileInputObj
                                    .hover(function(){$fileSelectionElementObj.hover()})
                                    .click(function(){$fileSelectionElementObj.click()})
                                    .change(function(){handleFileSelection($fileInputObj, $fileSelectionElementObj)});
                    }

                    function engageFileSelectionElement($fileSelectionElementObj)
                    {
                            if(optionsObj.doSetupModernFileSelectionModule)
                                    performModernFileSelectionElementEngagement($fileSelectionElementObj);
                            else
                                    performLegacyFileSelectionElementEngagement($fileSelectionElementObj);
                    }

                    function reengageFileSelectionElement($fileSelectionElementObj, $currentFormObj)
                    {
                            du$formQueue.push($currentFormObj.css("display", "none"));	
                            engageFileSelectionElement($fileSelectionElementObj);
                    }


            }
    }
	
})(jQuery)