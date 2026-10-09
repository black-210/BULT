cmake_minimum_required(VERSION 3.16)
project(BULT VERSION 1.0.0 LANGUAGES C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Wextra -pedantic -O2")

include_directories(include)

set(BULT_CORE_SRCS
    src/core/core.c
    src/rf/rf.c
    src/red_team/red.c
    src/blue_team/blue.c
    src/purple_team/purple.c
    src/physics/physics.c
    src/chemistry/chemistry.c
    src/forensics/forensics.c
)

# Core Shared Library
add_library(bult_core STATIC ${BULT_CORE_SRCS})
target_link_libraries(bult_core m)

# CLI Binary Executable
add_executable(bult src/cli/main.c)
target_link_libraries(bult bult_core m)

# Test Suite Runner
enable_testing()
add_executable(bult_test tests/test_all.c)
target_link_libraries(bult_test bult_core m)
add_test(NAME BultTestSuite COMMAND bult_test)
