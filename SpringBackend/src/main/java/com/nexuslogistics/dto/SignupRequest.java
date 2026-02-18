package com.nexuslogistics.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private String role; // ADMIN, DRIVER, WAREHOUSE

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}
