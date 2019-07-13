export const saveFile = async file => {
  const res = await fetch(
    `${
      process.env.REACT_APP_API_ORIGIN
    }/upload?content-type=${encodeURIComponent(file.type)}`,
    {
      method: 'POST'
    }
  )

  if (!res.ok) {
    throw new Error('Failed to save file')
  }

  const presignedPost = await res.json()

  const formData = new FormData()

  Object.keys(presignedPost.fields).forEach(key => {
    formData.append(key, presignedPost.fields[key])
  })

  formData.append('Content-Type', file.type)
  formData.append('file', file)
  const s3Response = await fetch(presignedPost.url, {
    method: 'POST',
    body: formData
  })

  if (!s3Response.ok) {
    throw new Error('Failed to upload to Amazon S3')
  }
}

export const getImages = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_ORIGIN}`, {
    method: 'GET'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch images')
  }

  return await res.json()
}

export const getAssetInfo = async id => {
  if (id === 1) {
    return {
      addedAt: Date.now(),
      durationInSeconds: 0,
      orientation: 1,
      mimeType: 'image/jpeg',
      AssetId: '1',
      width: 1080,
      height: 1920
    }
  } else {
    throw new Error('Not found')
  }
}
