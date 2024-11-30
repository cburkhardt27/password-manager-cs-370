// IPC stuff
// Just send it one way ... :(
document.getElementById('new').addEventListener('click', async () => {
  window.ipc.send('set-title', 'test')
})

document.getElementById('login').addEventListener('click', async () => {
  try {
    const result = await window.api.initDB()
    return result.data
  } catch (error) {
    console.error('Error in renderer init-db:', error)
  }
})