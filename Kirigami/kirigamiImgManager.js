
/*
  Manage async image loading.
*/
class kirigamiImgManager {

    /*! Constructor
      @param[in] inputElem input DOM element, type=file
      @param[in] readyCB Function called e the image data is ready
     */
    constructor(inputElem, readyCB) {
        this._inputElem = inputElem; // The input element in the page
        this._readyCB = readyCB
        this._file = null; // File data, if a file was selected for upload.
        this._fileImage = null; // Image object once the file is uploaded

        // A new image was scheduled for upload. 'change' is triggerd when the metadata is available.

        inputElem.addEventListener('change', event => {
            var that = this;
            const files = event.target.files;
            this._file = files[0];
            console.log('file', this._file); // FIXME:

            // Load the content
            this._fileImage = null;

           // Get the instance of the FileReader
            const reader = new FileReader();
            // Get the file object after upload and read the
            // data as URL binary string
            reader.readAsDataURL(this._file);

            // Once loaded, do something with the string
            reader.addEventListener('load', event => {
                // data is in event.target.result;
                var image = new Image();
                image.onload = () => {
                    console.log('FINISHED loading image'); // FIXME:
                    // once the image is in memory, assign the image object to this
                    that._fileImage = image;
                    // Callback once the image is ready
                    that._readyCB(image);

                };
                image.src = event.target.result;

                console.log('LOAD', event.target); // FIXME:
            });

            // Show progress
            reader.addEventListener('progress', (event) => {
                if (event.loaded && event.total) {
                    // Calculate the percentage completed
                    const percent = (event.loaded / event.total) * 100;
                    console.log('LOADED', percent, event.loaded, '/', event.total); // FIXME:
                }
            });
            
        });
    }

    // Return the image metadata. Null if no image was uploaded yet.
    get imageMetaData() {
        return this._file;
    }

    // Return the image data. Null if no image was uploaded yet.
    get image() {
        return this._fileImage;
    }
}
