import platform from 'platform'

const getPlatformName = () => {
  let os = platform.os.family || ''
  os = os.toLowerCase().replace(/ /g, '')
  if (/\bwin/.test(os)) {
    os = 'windows'
  } else if (/darwin|osx/.test(os)) {
    os = 'osx'
  } else if (/linux|freebsd|sunos|ubuntu|debian|fedora|redhat|suse/.test(os)) {
    os = 'linux'
  } else {
    os = 'other'
  }
  return os
}

const getCharacter = (event) => {
  if (event.which == null) {
    // NOTE: IE
    return String.fromCharCode(event.keyCode)
  } else if (event.which !== 0 && event.charCode !== 0) {
    // NOTE: the rest
    return String.fromCharCode(event.which)
  }
  return null
}

export default { getPlatformName, getCharacter }
