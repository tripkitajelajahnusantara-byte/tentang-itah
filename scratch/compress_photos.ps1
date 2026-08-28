Add-Type -AssemblyName System.Drawing
$imagesDir = "c:\Users\USER\Documents\Kerjaan\Freelance\Web\Tentang Itah\public\images"
$files = Get-ChildItem -Path $imagesDir -Filter *.jpg

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 60) # 60% Quality for Web

foreach ($file in $files) {
    if ($file.Length -gt 800KB) {
        $originalSizeMB = [Math]::Round($file.Length / 1MB, 2)
        Write-Host "Compressing $($file.Name) ($originalSizeMB MB)..."
        
        try {
            $bmp = New-Object System.Drawing.Bitmap($file.FullName)
            
            # Downscale if resolution is too high (max width 1600px for web display)
            $newWidth = $bmp.Width
            $newHeight = $bmp.Height
            if ($bmp.Width -gt 1600) {
                $newWidth = 1600
                $newHeight = [Math]::Round(($bmp.Height * 1600) / $bmp.Width)
                $resizedBmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $g = [System.Drawing.Graphics]::FromImage($resizedBmp)
                $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.DrawImage($bmp, 0, 0, $newWidth, $newHeight)
                $g.Dispose()
                $bmp.Dispose()
                $bmp = $resizedBmp
            }
            
            $tempPath = $file.FullName + ".tmp"
            $bmp.Save($tempPath, $encoder, $encoderParams)
            $bmp.Dispose()
            
            # Replace the original
            Remove-Item -Path $file.FullName -Force
            Rename-Item -Path $tempPath -NewName $file.Name -Force
            
            $newSizeKB = [Math]::Round((Get-Item $file.FullName).Length / 1KB, 2)
            Write-Host "Success: $($file.Name) is now $newSizeKB KB!"
        } catch {
            Write-Error "Failed to process $($file.Name): $_"
        }
    }
}
Write-Host "All images successfully optimized for rapid loading!"
