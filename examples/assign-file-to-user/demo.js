// sample function to get user id
const getUserId = () => {
  return new Promise((resolve) => {
    resolve({
      userId: 'SAMPLE_USER_ID'
    })
  });
};

// sample function for saving user data
const saveUserData = (data) => {
  return new Promise((resolve) => {
    console.log(data);
    resolve({
      success: true
    })
  });
};

window.addEventListener('DOMContentLoaded', function () {
  // user id taken from external source ie: your database, Facebook etc.
  getUserId().then((response) => {
    const userId = response.userId;
    const apikey = 'YOUR_APIKEY';
    const client = filestack.init(apikey);
    const options = {
      uploadInBackground: false,
      onFileUploadFinished: (response) => {
        // after file upload, make request with data to your application
        saveUserData({
          userId,
          fileHandle: response.handle
        }).then((res) => {
          console.log('User data has been saved', res);
        })
      }
    };
    const picker = client.picker(options);
    picker.open();
  });
});

