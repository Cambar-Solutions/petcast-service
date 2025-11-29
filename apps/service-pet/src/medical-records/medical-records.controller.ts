import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

/**
 * Controlador de Fichas Médicas
 * Maneja todas las operaciones CRUD para el historial médico de mascotas
 */
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  /**
   * Crear una nueva ficha médica
   * POST /api/medical-records
   */
  @Post()
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  /**
   * Obtener todas las fichas médicas
   * GET /api/medical-records
   */
  @Get()
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  /**
   * Obtener fichas médicas de una mascota específica
   * GET /api/medical-records/pet/:mascotaId
   */
  @Get('pet/:mascotaId')
  findByPet(@Param('mascotaId') mascotaId: string) {
    return this.medicalRecordsService.findByPet(+mascotaId);
  }

  /**
   * Obtener una ficha médica por ID
   * GET /api/medical-records/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findOne(+id);
  }

  /**
   * Actualizar una ficha médica
   * PATCH /api/medical-records/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.update(+id, updateMedicalRecordDto);
  }

  /**
   * Eliminar una ficha médica
   * DELETE /api/medical-records/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalRecordsService.remove(+id);
  }
}
