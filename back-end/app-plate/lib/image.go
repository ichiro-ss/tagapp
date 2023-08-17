package lib

import (
	"errors"
	"fmt"
	"image"
	"log"
	"mime/multipart"
	"os"

	"image/jpeg"
	_ "image/jpeg"
	"image/png"
	_ "image/png"
)

type ImgOperator interface {
	Save()
	String() string
}

type GoImg struct {
	Image         image.Image
	Path          string
	Type          string
	Height, Width int
}

func makeErrGoImg() GoImg {
	return GoImg{
		Image:  nil,
		Path:   "undefined",
		Type:   "undefined",
		Height: 0,
		Width:  0,
	}
}

func LoadImageFromFile(ifile *multipart.File) (GoImg, error) {
	errgoimag := makeErrGoImg()
	var err error

	src, itype, err := image.Decode(*ifile)
	if err != nil {
		fmt.Println("LoadIMageFromFile : cannot decode image")
		return errgoimag, err
	}

	size := src.Bounds().Size()
	width, height := size.X, size.Y

	goimg := GoImg{
		Image:  src,
		Path:   "undefined",
		Type:   itype,
		Width:  width,
		Height: height,
	}

	return goimg, nil
}

func LoadImage(path string) (GoImg, error) {
	file, err := os.Open(path)
	defer file.Close()

	if err != nil {
		return makeErrGoImg(), err
	}

	src, itype, err := image.Decode(file)
	if err != nil {
		log.Fatal(err)
		return makeErrGoImg(), err
	}

	size := src.Bounds().Size()
	width, height := size.X, size.Y

	img := GoImg{
		Image:  src,
		Path:   path,
		Type:   itype,
		Width:  width,
		Height: height,
	}

	return img, nil
}

func (img *GoImg) Save(dir, fname string) (string, error) {
	switch img.Type {
	case "png":
		fname += fname + ".png"
	case "jpeg":
		fname += fname + ".jpg"
	default:
		return "", errors.New("Invalid Image File Type")
	}

	path := dir + "/" + fname
	file, err := os.Create(path)
	if err != nil {
		log.Println("Cannot create File : ", err)
		return "", err
	}

	defer file.Close()

	switch img.Type {
	case "png":
		png.Encode(file, img.Image)
	case "jpeg":
		quality := 100
		options := jpeg.Options{Quality: quality}
		jpeg.Encode(file, img.Image, &options)
	}

	return path, nil
}
