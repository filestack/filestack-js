window.addEventListener('DOMContentLoaded', function () {
  const apikey = 'YOUR_APIKEY';
  const client = filestack.init(apikey);

  const makeDropPane = (container, opts) => {
    const options = {
      container, // can be CSS selector string or DOM node
      displayMode: 'dropPane',
      dropPane: {
        overlay: false, // if this is true then overlays will conflict between instances
        onSuccess: function (res) { console.log(res) },
      },
    };
    client.picker(options).open();
  };

  [ 'droppane1',
    'droppane2',
    'droppane3',
    'droppane4',
  ].forEach(function (id) {
    makeDropPane(id);
  });
});
