export async function executeRequestAction(request) {
  // This is deliberately a safe simulation: it does not call a college system.
  await new Promise((resolve) => setTimeout(resolve, 250))
  const actions = {
    NOC: 'NOC processing completed.',
    LEAVE: 'Leave request processing completed.',
    CERTIFICATE: 'Bonafide certificate processing completed.',
    GENERAL_REQUEST: 'Request was marked for manual processing.',
  }
  return { message: actions[request.category] || actions.GENERAL_REQUEST }
}
