// GL Posting Engine — Phase 4
// TODO: Implement batch GL posting from staging tables
//
// Flow:
//   1. Fetch unposted records from staging (PayPal/PingPong/Bank/Platform)
//   2. Lookup JournalTypeRule by (dataSource, journalType, bankAccountNum?)
//   3. Resolve comcode: Order.segment ?? sellerEmail→Partner.comcode
//   4. Lookup ExchangeRate for (period, inputCurr)
//   5. Build GLEntryInput array (Dr + Cr per transaction)
//   6. validateDoubleEntry(entries)
//   7. assertPeriodOpen(prisma, comcode, period)
//   8. generateGlIds(prisma, period, entries.length)
//   9. prisma.glEntry.createMany({ data: entries })
//  10. Mark source records as glPosted = true
//
// Alert khi PayPal type tidak ada matching rule (jangan silent fail)

export {}
