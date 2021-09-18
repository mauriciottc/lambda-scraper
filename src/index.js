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
  console.log('started')
  const dep = main.dependencies()
  const cookie = process.env.SUNO_COOKIE

  const reports = await dep.getAllReports()

  for (const report of reports) {
    const result = await dep.getHtml({
      cookie,
      ...report,
    })
    const carteira = result.splice(1, result.length - 2)

    if (carteira.length <= 0) {
      console.log('auth error')
      await dep.slimbot.sendMessage(report.chat_id, 'Erro de Autenticação')
      return
    }

    const diff = jsonDiff.diffString(
      filter(report.stocks),
      filter(carteira),
    )

    if (diff !== undefined && diff !== '') {
      const message = diff
        .replace(/\[/g, '')
        .replace(/\]/g, '')
      console.log(diff)
      await dep.slimbot.sendMessage(report.chat_id, `O report ${report.report_id} mudou!\n${message}`)
      await dep.updateLast(report.report_id, carteira)
    } else {
      console.log(`report: ${report.report_id} no difference`)
    }
  }
}

main.dependencies = () => ({
  getHtml: sunoService.getHtml,
  getAllReports: reportRepository.getAll,
  updateLast: reportRepository.update,
  slimbot: new Slimbot(process.env.TELEGRAM_API),
})

module.exports = {
  handler: main,
  main,
}
