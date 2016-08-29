import platform from 'platform'

let getPlatformName = function() {
  let os = platform.os.family || ''
  os = os.toLowerCase().replace(/ /g, '')
  if (/\bwin/.test(os)) {
    os = 'windows'
  } else if (/darwin/.test(os)) {
    os = 'osx'
  } else if (/freebsd|sunos/.test(os)) {
    os = 'linux'
  }
  return os
}

export default { getPlatformName }
