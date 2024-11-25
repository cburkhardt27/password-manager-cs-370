/*const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`*/

document.getElementById('login').addEventListener('click', async () => {
  /*const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
  };*/

  /*try {
    const result = await window.api.postData(userData);  // Call API exposed by preload
    document.getElementById('output').innerText = `Response: ${JSON.stringify(result, null, 2)}`;
  } catch (error) {
    console.error('Error sending POST data:', error);
    document.getElementById('output').innerText = 'Error occurred while sending data.';
  }*/

  try {
    const result = await window.api.initDB();
    document.getElementById('output').innerText = 'Initialized!'
  } catch (error) {
    console.error('Error in renderer init-db:', error)
    document.getElementById('output').innerText = 'Error in renderer!'
  }
});
