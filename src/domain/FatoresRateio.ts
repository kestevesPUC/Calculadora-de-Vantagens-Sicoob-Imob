import type Decimal from 'decimal.js'

export interface FatoresRateio {
  montanteDistribuivel: Decimal
  fatorDAV: Decimal
  fatorINV: Decimal
  fatorCobranca: Decimal
}
