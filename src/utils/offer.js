const statusMap = {
  created: 1,
  accepted: 2,
  withdrawn: 2,
  disputed: 3,
  finalized: 3,
  ruling: 4,
  sellerReviewed: 4
}

export function offerStatusToListingAvailability(status) {
  const pendingStates = ['created', 'accepted', 'disputed']
  const soldStates = ['finalized', 'sellerReviewed', 'ruling']

  if (pendingStates.includes(status)) {
    return 'pending'
  } else if (soldStates.includes(status)) {
    return 'sold'
  } else {
    return 'unknown'
  }
}

/**
 * Converts an offer's status into a step for the UI.
 */
export function offerStatusToStep(status) {
  return statusMap[status] || 0
}
