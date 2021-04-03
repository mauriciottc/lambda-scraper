const jsonDiff = require('json-diff')
const Slimbot = require('slimbot')
const sunoService = require('./services/suno')
const reportRepository = require('./repositories/report')

const filter = (obj) => obj.map(({ ticker, status, teto }) => ({
  ticker,
  status,
  teto,
}))

const main = async (event) => {
  const dep = main.dependencies()
  const cookie = process.env.SUNO_COOKIE

  const lastReport = await dep.getLast()

  const result = await dep.getCarteira({
    cookie,
    url: lastReport.url,
  })
  const carteiraValor = result.splice(1, result.length - 2)

  if (carteiraValor.length <= 0) {
    dep.slimbot.sendMessage(lastReport.chat_id, 'Erro de Autenticação')
    return
  }

  const diff = jsonDiff.diffString(
    filter(lastReport.stocks),
    filter(carteiraValor),
  )

  if (diff !== undefined && diff !== '') {
    const message = diff
      .replace(/\[/g, '')
      .replace(/\]/g, '')
    console.debug(diff)
    dep.slimbot.sendMessage(lastReport.chat_id, `O report mudou!\n${message}`)
    await dep.updateLast(carteiraValor)
  } else {
    console.debug('no difference')
  }
}

main.dependencies = () => ({
  getCarteira: sunoService.getCarteira,
  getLast: reportRepository.getLast,
  updateLast: reportRepository.update,
  slimbot: new Slimbot(process.env.TELEGRAM_API),
})

module.exports = {
  handler: main,
  main,
}
