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

export default { getPlatformName }
