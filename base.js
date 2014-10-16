(function(win) {
    "use strict"

    var pre = "_img_file_";
    var baseId = new Date() - 0;
    var MIME_TYPE = "application/octet-stream";
    var uploadURL = "http://w.com";
    var cache = {};
    var defOpt = {
    	fileSizeLimit: "5M",
    	formData: null,
    	fileObjName: 'upimage'
    };

    var File = function(sysFile) {
        this.id = pre + (baseId++);
        this.name = sysFile.name;
        this.size = sysFile.size;
        this._file = sysFile;
    };

    var h5upload = function(inputId, opt) {
        var input = document.getElementById(inputId), me = this;
        opt = opt || {};
        this.opt = opt;
        
        input.addEventListener("change", function() {
        	changeHandler.call(this, me);
        }, false);
    };

    var each = function(arr, fun) {
        var i = 0,
            l = arr.length,
            ret;
        while (i < l) {
            ret = fun.call(arr, arr[i], i);
            if (ret === false) {
                break;
            }
            ++i;
        }
    }

    function changeHandler(obj) {
        var files = this.files,
            file,
            opt = obj.opt;

        this.disabled = true;
        each(files, function(sys) {
            if (!sys.id) {
                file = new File(sys);
                cache[file.id] = file;
                sys.id = file.id;
                opt.onSelect && opt.onSelect(file);
                uploadFile.call(obj, file);
            }
        });
        console.log(cache);

        this.disabled = false;
    }

    function uploadProgress(event, file) {
        // console.info(event, file);
        file.onUploadProgress && file.onUploadProgress(event);
    }

    function uploadSuccess(event, file) {
        // console.log(event, file);
        this.opt.onUploadSuccess && this.opt.onUploadSuccess(file);
    }

    function uploadError(event, file) {
        // console.error(event, file);
        this.opt.onUploadError && this.opt.onUploadError(file);
    }

    function uploadFile(file) {
        var xhr, upload, bin, 
        	me = this,
        	form = new FormData();
        
        try{
        	form.append("file", file._file);
        }catch(e) {
        	uploadError.call(file, {type: "ioError"}, file);
        	return;
        }

        xhr = new XMLHttpRequest();
        upload = xhr.upload;

        upload.addEventListener("progress", function(event) {
            uploadProgress.call(me, event, file);
        }, false);
        upload.addEventListener("load", function(event) {
            uploadSuccess.call(me, event, file);
            xhr = null;
        }, false);
        upload.addEventListener("error", function(event) {
            uploadError.call(me, event, file);
            xhr = null;
        }, false);

        xhr.open("POST", uploadURL);
        xhr.overrideMimeType(MIME_TYPE);
        xhr.send(form);
    }

    win.h5upload = h5upload;
})(window);
