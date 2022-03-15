$content = Get-Clipboard -Format Image

If ($content) {

  $filename = $args[0]

  $content.Save($filename,'png')

  write-output $filename

} else {
  write-output 'no image'
}