# Support Site

Bu proje, kullanıcıların destek talebi oluşturacağı ve ilgili birimlerin, kullanıcıların destek taleplerini yanıtlama üzerine geliştirilmiş full-stack web sitesidir.

## Özellikler

- Kullanıcı kaydı ve giriş (JWT login)
- Bilet oluşturma; bilet türü ve öncelik sırası
- Admin rolü; tüm biletlere erişir, tüm biletleri cevaplayabilir ve tüm biletleri kapatabilir
- User rolü; biletleri oluşturur, sadece kendi biletlerini görür ve admin yanıtladıysa bilete cevabını yazabilir.

## Teknolojiler

- **Backend:** JDK 21, Spring Boot, Spring Security Spring, Data JPA, H2 Database, Lombok
- **Frontend:** React, Axios, React Router, AntDesign.

- **Araçlar:** Maven, NPM

## Kurulum & Uygulamayı çalıştırma

1. Repo klonla:
	1. `git clone https://github.com/rbaykan/SupportSite.git`
2. Spring Boot uygulamasını çalıştır
	1. Proje içindeki `Springboot` klasörüne geç `cd springboot`
	2. Bağımlılıkları yükle `mvn install`
	3. Uygulamayı çalıştır `mvn spring-boot:run`
3. React uygulamasını çalıştır
	1. Proje içindeki `React` klasörüne geç `cd React`
	2. Bağımlılıkları yükle `npm install`
	3. Uygulamayı çalıştır `npm run dev`
4. Uygulamaya geçiş
	1. Tarayıcıdan http://localhost:5173 adresine girerek uygulamaya erişebilirsin.
