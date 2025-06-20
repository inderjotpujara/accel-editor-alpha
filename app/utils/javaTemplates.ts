/**
 * Java project templates and code generators.
 */

export interface JavaClassTemplate {
  name: string;
  content: string;
  description: string;
}

export interface MavenTemplate {
  name: string;
  content: string;
  description: string;
}

export interface GradleTemplate {
  name: string;
  content: string;
  description: string;
}

/**
 * Maven pom.xml templates.
 */
export const MAVEN_TEMPLATES: Record<string, MavenTemplate> = {
  basic: {
    name: 'Basic Maven Project',
    description: 'A simple Maven project with standard structure',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-project</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>My Project</name>
    <description>A sample Maven project</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.9.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.0.0-M9</version>
            </plugin>
        </plugins>
    </build>
</project>`,
  },

  springBoot: {
    name: 'Spring Boot Maven Project',
    description: 'Maven project configured for Spring Boot',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>spring-boot-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Spring Boot Application</name>
    <description>Spring Boot application</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
};

/**
 * Gradle build.gradle templates.
 */
export const GRADLE_TEMPLATES: Record<string, GradleTemplate> = {
  basic: {
    name: 'Basic Gradle Project',
    description: 'A simple Gradle project with standard structure',
    content: `plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.9.2'
}

test {
    useJUnitPlatform()
}`,
  },

  springBoot: {
    name: 'Spring Boot Gradle Project',
    description: 'Gradle project configured for Spring Boot',
    content: `plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
    useJUnitPlatform()
}`,
  },

  kotlinDsl: {
    name: 'Gradle Kotlin DSL Project',
    description: 'Gradle project using Kotlin DSL',
    content: `plugins {
    java
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
}

group = "com.example"
version = "1.0.0"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}`,
  },
};

/**
 * Java class templates.
 */
export const JAVA_CLASS_TEMPLATES: Record<string, JavaClassTemplate> = {
  main: {
    name: 'Main Class',
    description: 'A basic main class with main method',
    content: `package com.example;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },

  springBootApplication: {
    name: 'Spring Boot Application',
    description: 'Spring Boot main application class',
    content: `package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`,
  },

  restController: {
    name: 'REST Controller',
    description: 'Spring Boot REST controller',
    content: `package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }
}`,
  },

  service: {
    name: 'Service Class',
    description: 'Spring service class',
    content: `package com.example.service;

import org.springframework.stereotype.Service;

@Service
public class HelloService {

    public String getGreeting() {
        return "Hello from service!";
    }
}`,
  },

  entity: {
    name: 'JPA Entity',
    description: 'JPA entity class',
    content: `package com.example.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // Constructors
    public User() {}

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}`,
  },

  test: {
    name: 'JUnit Test',
    description: 'JUnit 5 test class',
    content: `package com.example;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class MainTest {

    @BeforeEach
    void setUp() {
        // Setup code here
    }

    @Test
    void testExample() {
        // Test implementation
        assertTrue(true, "This test should pass");
    }
}`,
  },
};

/**
 * Application properties templates.
 */
export const PROPERTIES_TEMPLATES = {
  basic: {
    name: 'Basic Application Properties',
    description: 'Basic Spring Boot application properties',
    content: `# Server configuration
server.port=8080

# Application configuration
spring.application.name=my-app

# Database configuration (H2 for development)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console (for development)
spring.h2.console.enabled=true`,
  },
};

/**
 * Get template content by type and name.
 */
export function getTemplate(type: 'maven' | 'gradle' | 'java' | 'properties', name: string): string | null {
  switch (type) {
    case 'maven': {
      return MAVEN_TEMPLATES[name]?.content || null;
    }
    case 'gradle': {
      return GRADLE_TEMPLATES[name]?.content || null;
    }
    case 'java': {
      return JAVA_CLASS_TEMPLATES[name]?.content || null;
    }
    case 'properties': {
      return PROPERTIES_TEMPLATES[name as keyof typeof PROPERTIES_TEMPLATES]?.content || null;
    }
    default: {
      return null;
    }
  }
}
