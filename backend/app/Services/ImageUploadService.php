<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageUploadService
{
    /**
     * Upload image and optionally create a thumbnail
     *
     * @param \Illuminate\Http\UploadedFile $image
     * @param string $folder
     * @param array|null $thumbnailSize [width, height]
     * @return string image name
     */
    public function uploadImage($image, $folder, $thumbnailSize = null)
    {
        $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();

        $uploadPath = public_path("uploads/{$folder}");
        if (!File::exists($uploadPath)) {
            File::makeDirectory($uploadPath, 0755, true);
        }

        $image->move($uploadPath, $imageName);

        if ($thumbnailSize) {
            $manager = new ImageManager(new Driver());
            $img = $manager->read($uploadPath . '/' . $imageName);
            $img->cover($thumbnailSize[0], $thumbnailSize[1]);

            $smallPath = public_path("uploads/{$folder}/small");
            if (!File::exists($smallPath)) {
                File::makeDirectory($smallPath, 0755, true);
            }

            $img->save($smallPath . '/' . $imageName);
        }

        return $imageName;
    }

    /**
     * Delete image and its thumbnail
     *
     * @param string $folder
     * @param string $imageName
     * @return void
     */
    public function deleteImage($folder, $imageName)
    {
        $imagePath = public_path("uploads/{$folder}/{$imageName}");
        $smallImagePath = public_path("uploads/{$folder}/small/{$imageName}");

        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }

        if (File::exists($smallImagePath)) {
            File::delete($smallImagePath);
        }
    }
}
