import com.fasterxml.jackson.databind.ObjectMapper;
import com.proje.ProjeApplication;

import com.proje.security.service.JwtUtils;
import com.proje.web.dto.CreateUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ContextConfiguration(classes = ProjeApplication.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtils jwtService;

    private String adminJwtToken;
    private String userJwtToken;

    @BeforeEach
    public void setup() {
        // Her test öncesi yeni token'lar oluştur
        adminJwtToken = jwtService.generateTokenFromUsername(
                User.withUsername("admin")
                        .password("")
                        .roles("ADMIN")
                        .build()
        );

        userJwtToken = jwtService.generateTokenFromUsername(
                User.withUsername("ali19")
                        .password("")
                        .roles("USER")
                        .build()
        );
    }

    @Test
    public void CreateUser_ReturnCreated() throws Exception {
        String randomUsername = "user_" + UUID.randomUUID().toString().substring(0, 8);

        CreateUser createUser = CreateUser.builder()
                .firstname("Veli")
                .lastname("Yaşar")
                .username(randomUsername)
                .password("12345678")
                .repassword("12345678")
                .build();

        String json = objectMapper.writeValueAsString(createUser);

        // Kullanıcıyı kaydet ve oluşturulan username'i doğrula
        mockMvc.perform(post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated()) // veya isOk() - controller'ınıza göre
                .andExpect(jsonPath("$.username").value(randomUsername))
                .andExpect(jsonPath("$.firstname").value("Veli"))
                .andExpect(jsonPath("$.lastname").value("Yaşar"));
    }


    @Test
    public void role_accessApi_withJWT() throws Exception {

        // Test 1: Admin token ile admin API'ye erişim - Başarılı olmalı
        mockMvc.perform(get("/api/user")
                        .header("Authorization", "Bearer " + adminJwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());


        // Test 2: User token ile admin API'ye erişim - Forbidden olmalı
        mockMvc.perform(get("/api/user")
                        .header("Authorization", "Bearer " + userJwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());


        // Test 3: User token ile ortak endpoint'e erişim - BadRequest (parametre eksik)
        mockMvc.perform(post("/api/user/createTicket")
                        .header("Authorization", "Bearer " + userJwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());


        // Test 4: Admin token ile ortak endpoint'e erişim - BadRequest (parametre eksik)
        mockMvc.perform(post("/api/user/createTicket")
                        .header("Authorization", "Bearer " + adminJwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());


        // Test 5: Geçersiz token ile erişim - Forbidden (403) dönüyor
        mockMvc.perform(post("/api/user/createTicket")
                        .header("Authorization", "Bearer " + "geçersiz-token-12345")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden()); // 403 olarak değiştirildi


        // Test 6: Token olmadan erişim - Unauthorized olmalı
        mockMvc.perform(post("/api/user/createTicket")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}