$content = Get-Clipboard -Format Image

If ($content) {

  $filename = $env:USERPROFILE + "\Desktop\capture.png"

  $content.Save($filename,'png')

  write-output $filename

} else {
  write-output 'no image'
}