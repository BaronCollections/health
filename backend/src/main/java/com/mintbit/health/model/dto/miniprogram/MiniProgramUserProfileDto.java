package com.mintbit.health.model.dto.miniprogram;

import lombok.Data;

@Data
public class MiniProgramUserProfileDto {

    private Long id;
    private String nickname;
    private String phone;
    private Boolean phoneBound;
}
