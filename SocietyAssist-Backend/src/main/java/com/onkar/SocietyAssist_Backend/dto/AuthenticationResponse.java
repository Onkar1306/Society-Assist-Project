package com.onkar.SocietyAssist_Backend.dto;

import com.onkar.SocietyAssist_Backend.security.Role;

public record AuthenticationResponse(String token, String tokenType, Role role, Long userId) {
}
