package db

import (
	"ameato/model"
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {

	dsn := createDsn(os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	
	if err != nil {
		fmt.Println(err)
		return nil
	}

	db.AutoMigrate(
		&model.Message{},
	)


	return db
}

func createDsn(username string, password string, dbname string) string {
	return fmt.Sprintf("%s:%s@tcp(db:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local", username, password, dbname)
}