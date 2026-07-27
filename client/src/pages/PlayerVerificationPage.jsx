const handleVerification = async (event) => {
  event.preventDefault()

  try {
    setLoading(true)
    setError('')

    const result = await verifyPlayer({
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth
    })

    sessionStorage.setItem(
      'playerVerification',
      JSON.stringify(result.record)
    )

    navigate('/signup/player-profile')
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}