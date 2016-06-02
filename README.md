# About
DynamicUpload is a jQuery plug-in which can be used to transform a set of elements in to the components of a facility that can be used to queue multiple files for upload, as well as conduct the upload of said files, without the use of HTML5 or external technologies (Flash, Silverlight, etc.)

Externally, DynamicUpload is simple to use, customizable, and requires no changes to existing markup.

Internally, DynamicUpload is well-structure, and easy to follow. It has also been fully tested for correct functionality and performance.

# How to use
    //Set up a DynamicUpload facility which features the button with the id "queueFileButton" as that which is to queue
    //files for upload, and the button with the id "startUploadButton" as that which commences the upload of said files
    //Note: "#startUploadButton" can be substituted with another selector, a DOM element, or a jQuery object
    $("#queueFileButton").dynamicUpload("#startUploadButton", optionsObj);
    
    //Remove the file at queueIndex from the DynamicUpload queue
    $("#queueFileButton").dynamicUpload("removeQueueElement", queueIndex); //$("#startUploadButton") can invoke this too
    
    //Progrmatically commence the upload of the file at the head of the DynamicUpload queue. The second parameter of
    //this function is defined as a boolean which denotes whether the queue is to be popped (an act which will redefine
    //its head) before the head of the queue is to be determined. This function is intended for use in any function
    //specified as a replacement for that which contains the default file upload logic of the facility. 
    $("#startUploadButton").dynamicUpload("uploadQueueHead", false);  //$("#queueFileButton") can invoke this too
    
# Options
    var optionsObj = {
            doSetupModernFileSelectionModule: true,                      //A boolean which determines how the file 
                                                                         //selection module of the facility is to work.
                                                                         //If true, the file selection dialog is spawned
                                                                         //when an onclick handler for the "file 
                                                                         //selection element" programatically clicks a
                                                                         //generated, discreet file input element. If 
                                                                         //false, the file selection dialog is spawned
                                                                         //when a hidden file input element generated
                                                                         //on top of the "file selection element", is
                                                                         //clicked (visual click feedback for said 
                                                                         //element must thus be implemented manually).If
                                                                         //compatibility with older browsers is desired,
                                                                         //set to false
			
			doSetupModernUploadModule: true,                            //A boolean which determines how the default 
			                                                            //upload module of the facility to work.
			                                                            //If true, the module will upload files via
			                                                            //XMLHttpRequest dispatch; if false, the module
			                                                            //will upload files via synchronous-request
			                                                            //dispatch through a discreet iframe. If
			                                                            //compatibility with older browsers is desired,
			                                                            //set to false
			
			uploadFormTypeClass: "dynamicUploadForms",                  //The desired class name of the forms   
			                                                            //created used by the facility
			
			uploadFormFileInputClass: "dynamicUploadFormFileInputs",    //The desired class name of the file inputs  
			                                                            //created and used by the facility
			                                                            
			uploadFormFileInputName: "Filedata",                        //The desired name of the file inputs created 
			                                                            //and used by the facility, and as such, that of
			                                                            // HTTP request parameter which is to key file
			                                                            //data in the file upload requests created by
			                                                            //the facility 
			                                                            
			uploadFormHiddenInputNameToValueObj: {},                   //An object, the property-value pairs of which
			                                                           //are each composed of the name (property), and 
			                                                           //value (value) of both a hidden input element,
			                                                           //and, by extension, a HTTP request parameter, to
			                                                           //be respectively inserted in all forms and file
			                                                           //upload requests created by the facility
			
			uploadFormAction: "",                                      //The URI which files queued through  
			                                                           //the facility are to be uploaded to
			
			uploadIframeHandle: "dynamicUploadIframe",                 //The desired value for the id and name of the
			                                                           //iframe through which files are to be uploaded,
			                                                           //if doSetupModernUploadModule === false
			                                                           
			acceptedFileExtensionArray: [],                           //An array consisting of asterisk-prefixed 
			                                                          //extensions of files that can be queued for
			                                                          //upload with the plug-in
			                                                         
            uploadFile: defaultUploadFile /* <~~ private function*/,  //A function which contains the logic of the 
                                                                      //upload module of the facility. Defines the
                                                                      //following parameters:
                                                                      //$formObj: A jQuery object representing the form
                                                                      //          that containsthe file input in which
                                                                      //          the to-be-uploaded file is specified
			
			onFileSelectSuccess: null,               //A function to be called following the selection of  
			                                         //a file with an extension in acceptedFileExtensionArray
			                                         //Defines the following parameters (in order of appearance):
			                                         //fileName:       The name of the successfully selected file
			                                         //fileExtension:  The extension of the successfully selected file
			                                         //fileQueueIndex: The index of the successfully selected file 
			                                         //                in the upload queue
			                                         
			onFileSelectFailure: null,               //A function to be called following the selection of a file
			                                         //with an extension absent from acceptedFileExtensionArray
			                                         //Defines the following parameters (in order of appearance):
			                                         //fileName:       The name of the successfully selected file
			                                         //fileExtension:  The extension of the successfully selected file
			                                         //acceptedFileExtensionArray: acceptedFileExtensionArray 
			
			beforeFileUploadStart: null,             //A function to be called directly before a file is to be uploaded
		                                             //Defines the following parameters (in order of appearance):
			                                         //$fomrObj: A jQuery object representing the form that contains
			                                         //          the file input in which the to-be-uploaded file is
			                                         //          specified
			
			afterFileUploadEnd: null                 //A function to be called directly after a server response to a
			                                         //file upload request produced by the DEFAULT file upload module.
			                                         //The function returns true if the upload of queue elements is to
			                                         //continue, or false if it is not. Defines the following parameters
			                                         (in order of appearance):
			                                         //responseObj: The server response, if doSetupModernUploadModule
			                                         //            === true, or, if doSetupModernUploadModule === false,
			                                         //            a jQuery object representing data that, depending on
			                                         //            the mime-type of the server response, either is the
			                                         //            response or contains the response. If 
			                                         //            doSetupModernUploadModule === false the response will
			                                         //            be retrieved from an iframe, thus, is if 
			                                         //            uploadFormAction does not have the same origin as 
			                                         //            that of the plug-in file, the response cannot be 
			                                         //            read, and this will be ""
			                                         //textStatus: A String describing the status of the directly
			                                         //            -preceeding file upload, if doSetupModernUploadModule
			                                         //            === true, undefined otherwise
    }
    
# Demo
A demo of DynamicUpload can be found [here](https://jsfiddle.net/eb31gwfd/2/)
    
# Licensing and usage information
DynamicUpload is licensed under the MIT License.

Informally, It'd be great to be notified of any derivatives or forks (or even better, issues or refactoring points that may inspire one)!

More informally, it'd really be great to be notified any uses in open-source, educational, or (if granted a license) commercial contexts. Help me build my portfolio, if you found the library helpful it only takes an e-mail!
    
    