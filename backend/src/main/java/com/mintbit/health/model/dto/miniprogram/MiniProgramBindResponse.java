package com.mintbit.health.model.dto.miniprogram;

import lombok.Data;

@Data
public class MiniProgramBindResponse {

    private String accessToken;
    private String refreshToken;
    private MiniProgramUserProfileDto profile;
}
