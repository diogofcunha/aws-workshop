import util from 'util'

export const getEventSourceObjectKey = event => {
  // Read options from the event.
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 })
  )

  // Object key may have spaces or unicode non-ASCII characters.
  const { Message } = JSON.parse(event.Records[0].body)

  try {
    const key = decodeURIComponent(
      JSON.parse(Message).Records[0].s3.object.key.replace(/\+/g, ' ')
    )

    if (!key) {
      throw new Error()
    }

    return key
  } catch (ex) {
    throw new Error(`Could not find key for event:`, Message)
  }
}
