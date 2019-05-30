window.addEventListener('DOMContentLoaded', function () {
  const apikey = 'YOUR_APIKEY';
  const client = filestack.init(apikey);

  const onProgress = (evt) => {
    document.getElementById('progress').innerHTML = `${evt.totalPercent}%`;
  };

  document.querySelector('input').addEventListener('change', (event) => {
    const files = event.target.files;
    const file = files.item(0);
    const token = {};
    const cancel = document.getElementById('cancel');
    const pause = document.getElementById('pause');
    const resume = document.getElementById('resume');

    [cancel, resume, pause].forEach((btn) => {
      const id = btn.id;
      btn.addEventListener('click', () => {
        token[id]();
      });
    });

    client.upload(file, { onProgress }, {}, token)
      .then(res => {
        console.log('success: ', res)
      })
      .catch(err => {
        console.log(err)
      });
  });
});
