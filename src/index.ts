import app from './app'

const PORT = (parseInt(process.env.PORT ?? '8000'))

app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}...`)
})
