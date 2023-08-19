package lib

import (
	"os"
	"path/filepath"
)

func RemoveExtension(filename string) string {
	return filename[:len(filename)-len(filepath.Ext(filename))]
}

func RemoveFile(path string) error {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		return nil
	}

	err = os.Remove(path)

	if err != nil {
		return err
	}

	return nil
}
