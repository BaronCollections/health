package com.mintbit.health.model.dto.miniprogram;

import lombok.Data;

@Data
public class MiniProgramLoginResponse {

    private Boolean bindRequired;
    private String bindToken;
    private String accessToken;
    private String refreshToken;
    private MiniProgramUserProfileDto profile;
}
