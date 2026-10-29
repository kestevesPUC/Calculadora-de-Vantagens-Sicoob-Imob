import Decimal from 'decimal.js'

// Precisão alta o bastante para valores de até bilhões sem perda (caso J).
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP })

export { Decimal }
