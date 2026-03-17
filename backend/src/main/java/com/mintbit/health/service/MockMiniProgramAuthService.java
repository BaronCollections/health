package com.mintbit.health.service;

import com.mintbit.health.model.dto.miniprogram.MiniProgramBindResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramLoginResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramSmsSendResponse;
import com.mintbit.health.model.dto.miniprogram.MiniProgramUserProfileDto;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MockMiniProgramAuthService {

    public MiniProgramLoginResponse login(String code) {
        String normalizedCode = blankToDefault(code, "wx-code-bind");

        if (normalizedCode.contains("bound")) {
            MiniProgramLoginResponse response = new MiniProgramLoginResponse();
            response.setBindRequired(false);
            response.setAccessToken("mini-access-" + UUID.randomUUID());
            response.setRefreshToken("mini-refresh-" + UUID.randomUUID());
            response.setProfile(createProfile(7L, "Bound User", "13800138000", true));
            return response;
        }

        MiniProgramLoginResponse response = new MiniProgramLoginResponse();
        response.setBindRequired(true);
        response.setBindToken("bind-token-" + Math.abs(normalizedCode.hashCode()));
        response.setProfile(createProfile(0L, "WeChat Visitor", "", false));
        return response;
    }

    public MiniProgramSmsSendResponse sendSmsCode(String phone) {
        MiniProgramSmsSendResponse response = new MiniProgramSmsSendResponse();
        response.setStatus("sent");
        response.setCooldownSeconds(60);
        response.setMaskedPhone(maskPhone(phone));
        return response;
    }

    public MiniProgramBindResponse bindPhone(String phone, String smsCode, String bindToken) {
        if (isBlank(phone) || isBlank(smsCode) || isBlank(bindToken)) {
            throw new IllegalArgumentException("Phone, smsCode, and bindToken are required");
        }

        return createSession(phone, "MintBit User");
    }

    public MiniProgramBindResponse refreshSession(String authorizationHeader) {
        String phone = authorizationHeader != null && authorizationHeader.contains("bound")
                ? "13800138000"
                : "13900001234";
        return createSession(phone, "MintBit Member");
    }

    public MiniProgramUserProfileDto getProfile(String authorizationHeader) {
        String phone = authorizationHeader != null && authorizationHeader.contains("bound")
                ? "13800138000"
                : "13900001234";
        return createProfile(7L, "MintBit Member", phone, true);
    }

    private MiniProgramBindResponse createSession(String phone, String nickname) {
        MiniProgramBindResponse response = new MiniProgramBindResponse();
        response.setAccessToken("mini-access-" + UUID.randomUUID());
        response.setRefreshToken("mini-refresh-" + UUID.randomUUID());
        response.setProfile(createProfile(7L, nickname, blankToDefault(phone, "13800138000"), true));
        return response;
    }

    private MiniProgramUserProfileDto createProfile(Long id, String nickname, String phone, boolean phoneBound) {
        MiniProgramUserProfileDto profile = new MiniProgramUserProfileDto();
        profile.setId(id);
        profile.setNickname(nickname);
        profile.setPhone(phone);
        profile.setPhoneBound(phoneBound);
        return profile;
    }

    private String maskPhone(String phone) {
        String normalizedPhone = blankToDefault(phone, "13800138000");
        if (normalizedPhone.length() < 7) {
            return normalizedPhone;
        }
        return normalizedPhone.substring(0, 3) + "****" + normalizedPhone.substring(normalizedPhone.length() - 4);
    }

    private String blankToDefault(String value, String fallback) {
        return isBlank(value) ? fallback : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
