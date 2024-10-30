package com.ucamp.movieus.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetMail(String to, String resetUrl) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // HTML 파일 로드
        String htmlContent = Files.readString(
                new ClassPathResource("templates/email.html").getFile().toPath(),
                StandardCharsets.UTF_8
        );

        // resetUrl을 실제 링크로 설정
        htmlContent = htmlContent.replace("${resetUrl}", resetUrl);

        helper.setTo(to);
        helper.setSubject("비밀번호 변경 요청");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}

